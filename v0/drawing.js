function BrushStyle(color, width) {
    this.color = color;
    this.width = width || 25;
    this.lineCap = "round";
    this.lineJoin = "round";
}

// Overrides the prototype property
BrushStyle.prototype = {
    applyStyle: function(c) {
        c.lineWidth = this.width;
        c.strokeStyle = this.color;
        c.lineCap = this.lineCap;
        c.lineJoin = this.lineJoin;
    },
    toString: function() {
        var state = "{" +
            "color: " + this.color + ", " +
            "width: " + this.width + ", " +
            "lineCap: " + this.lineCap + ", " +
            "lineJoin: " + this.lineJoin +
        "}";
        return state;
    }
};


window.onload = function() {
    var userCanvas = document.getElementById("user-drawing");
	var userContext = userCanvas.getContext("2d");
    
    var trailCanvas = document.getElementById("trail-drawing");
	var trailContext = trailCanvas.getContext("2d");

    // --- Palette -----

    var paletteControl = (function() {
    	var context;

	    // Stsee colors
	    var palette = ['B04141', '85224A', 'EBE3B2', '1A4F6B', '042B4F'];
	    
	    var brushStyles = [];

	    for (var i = 0; i < palette.length; i++) {
	        var paletteColor = '#' + palette[i];
	        var style = new BrushStyle(paletteColor);        
	        brushStyles.push(style);
	    }
	    // alert(brushStyles);
    	var currentBrushStyle = brushStyles[4]; // Pick an arbitrary one
    	//currentBrushStyle.applyStyle(context);

	    var colorElts = [];
	    
	    for (var i = 0; i < 5; i++) {
	        var elt = document.getElementById('color-' + (i+1));
	        colorElts.push(elt);
	        
	        elt.style.backgroundColor = '#' + palette[i];

	        elt.onclick = (function(iter) {
	            var result = function(e) {
	                // alert('got ' + iter);
	                currentBrushStyle = brushStyles[iter];

	                if (!context) {
	                	alert("Missing context");
	                }
	                currentBrushStyle.applyStyle(context);
	                
	                // Unselect all
	                for (var j = 0; j < colorElts.length; j++) {
	                    colorElts[j].setAttribute('class', 'color-panel');
	                }
	                // Select me
	                this.setAttribute('class', 'color-panel selected');
	            };
	            return result;
	        })(i);
	    }
	    return {
	    	init: function(ctx) {
	    		context = ctx;
				currentBrushStyle.applyStyle(context);
	    	}
	    	, reapplyStyle: function() {
				currentBrushStyle.applyStyle(context);
	    	}
	    	, getCurrentBrush: function() {
	    		return currentBrushStyle;
	    	}
	    };
    })();
    
    paletteControl.init(trailContext);

    function Stroke(x, y, state) {
    	var self = this;
    	
    	self.startTime = new Date().getTime();
    	self.start = {x:x, y:y};

    	var getDTime = function() {
    		return (new Date().getTime()) - self.startTime;
    	};

    	self.pieces = [];

    	self.add = function(x, y, state) {
    		this.pieces.push({
    			time: getDTime(),
    			x: x,
    			y: y,
    			state: state
    		});
    	};

    	self.add(x, y, state);

    	self.replay = function(context) { // TrailContext

    		var layer = document.getElementById('user-drawing');

//    		layer.style.display = 'block'; // Block drawing!

    		//log('Layer blocking: ' + layer.style.zIndex);

    		for (var i = 1; i < self.pieces.length; i++) {
    			(function(iter) {
    				var p = self.pieces[iter];

	    			setTimeout(function() {		
						var prev = self.pieces[iter-1];
						p.state.applyStyle(context);
						context.beginPath();
						context.moveTo(prev.x, prev.y);
	    				context.lineTo(p.x, p.y);
	    				context.stroke();
	    			}, p.time);
    			})(i);
    		}
    		/*
			// Restore user control
			var p = self.pieces[self.pieces.length-1];
    		setTimeout(function() {
				layer.style.display = 'none';
    		}, p.time + 10);
			*/
    	}
    }

    function log(msg) {
		$('#log').append(msg);
	}

    function StrokeCollection() {
    	// TODO: save
    }

    //--------------------

    function clearReplayStrokes(c, strokeCollection) {
    	// Clear all the canvas and replay stroke
    	c.beginPath();
    	c.rect(0, 0, 600, 400);
    	c.fillStyle = "white";
    	c.fill();

    	for (var i=0; i<strokeCollection.length; i++) {
    		var s = strokeCollection[i];
    		s.replay(trailContext);
    	}
    }

    var paintCanvas = (function(canvas, context) {
    	var c = context;

	    var strokeCollection = [];
	    var stroke;

	    var brush = {
	        startStroke: function(x, y) {
	            c.beginPath();
	            c.moveTo(x, y);

	            stroke = new Stroke(x, y);
		    },
	        stroke: function(x, y) {
	            c.lineTo(x, y);
	            c.stroke();

	            var state = paletteControl.getCurrentBrush();
	            stroke.add(x, y, state);
	        },
	        strokeEnd: function() {
	        	strokeCollection.push(stroke);

	        	clearReplayStrokes(c, strokeCollection);
	        }
	    };

	    var drawing = false;

	    canvas.onmousedown = function(event) {
	    	var p = getMousePos(event);

	        brush.startStroke(p.x, p.y);

	        drawing = true;
	    };

	    canvas.onmousemove = function(event) {
	    	var p = getMousePos(event);

	        if (drawing) {
	            brush.stroke(p.x, p.y);
	        }
	    };

	    canvas.onmouseup = function(event) {
	        drawing = false;
	        brush.strokeEnd();
		};

		function getBorderSize() {
	    	var borderLeftPx = undefined;

	    	if (window.getComputedStyle) {
	    	    var cssStyle = window.getComputedStyle(canvas, null);
	    	    borderLeftPx = cssStyle.getPropertyValue('border-left-width');
	    	}
	    	else if (canvas.currentStyle) {
	            borderLeftPx = canvas.currentStyle.borderLeftWidth;
	    	} else if (canvas.style) {
	    	    borderLeftPx = canvas.style['border-left-width'];
	    	}
			// alert("BorderLeftPx: " + borderLeftPx);

	        var border = (borderLeftPx) ? parseInt(borderLeftPx, 10) : 16;    	    
		    return border;
		}
		
		var border = getBorderSize();
	    
		function getMousePos(event) {
	    	if (!event) { event = window.event; } // This is for IE's global window.event
	    	
		    var r = canvas.getBoundingClientRect();
	    	var coords = {
	    		x : event.clientX - r.left - border,
	    		y : event.clientY - r.top - border
	    	};
	    	return coords;
	    }
    })(trailCanvas, trailContext);

};

