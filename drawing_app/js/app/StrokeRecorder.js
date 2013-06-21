var StrokeRecorder = function(userCanvas, paletteControl) {
	if (!userCanvas) {
		throw new Error("StrokeRecorder(): Missing userCanvas param");
	}
	if (!paletteControl) {
		throw new Error("StrokeRecorder(): Missing paletteControl param");
	}

	var self = this;

	this.userCanvas = userCanvas;

	var c = userCanvas.getContext('2d');

    this.brush = {
        startStroke: function(x, y) {
        	if (!self.strokeModel) {
        		throw new Error("StrokeRecorder: forgot to setStrokeModel(m)!");
        	}
        	0 && console.log("brush.startStroke()");
            c.beginPath();
            c.moveTo(x, y);

            var brush = paletteControl.getCurrentBrush();
            self.strokeModel.startStroke(x, y, brush);
	    },
        stroke: function(x, y) {
        	0 && console.log("brush.stroke()");
            c.lineTo(x, y);
            c.stroke();

            var brush = paletteControl.getCurrentBrush();
            self.strokeModel.stroke(x, y, brush);
        },
        strokeEnd: function() {
        	0 && console.log("brush.strokeEnd()");
        	self.strokeModel.strokeEnd();
        }
    };
}

StrokeRecorder.prototype.setStrokeModel = function(m) {
	this.strokeModel = m;
};

StrokeRecorder.prototype.clearScreen = function() {
	var w = this.userCanvas.width;
	this.userCanvas.width = w; // Reset the whole canvas!

	// Reset last state
    var c = this.userCanvas;
    var brush = paletteControl.getCurrentBrush();
    brush.applyStyle(c.getContext('2d'));
};

StrokeRecorder.prototype.init = function() {
	var self = this;
	var canvas = self.userCanvas;
    var drawing = false;
    var touchId = 0;

    var startStroke = function(x, y) {
        drawing = true;

        var b = self.brush;
        b.startStroke(x, y);
        b.stroke(x+1, y+1); // Trick to draw a dot
    };

    var stroke = function(x, y) {
        if (drawing) {
            self.brush.stroke(x, y);
        }
    };

    var strokeEnd = function() {
        self.brush.strokeEnd();
        drawing = false;
    };

    var strokeCancel = function() {
        move = drawing = false;
        self.brush.cancelStroke();
    }

    canvas.onmousedown = function(event) {
        var p = getMousePos(event);
        startStroke(p.x, p.y);
    };
    canvas.onmousemove = function(event) {
        var p = getMousePos(event);
        stroke(p.x, p.y);
    };
    canvas.onmouseup = function(event) {
        strokeEnd();
    };

    if (true) {
        var context = canvas.getContext('2d');

        // create a drawer which tracks touch movements
        var drawer = {
            isDrawing: false,
            touchstart: function(coors){
                context.beginPath();
                context.moveTo(coors.x, coors.y);
                this.isDrawing = true;
            },
            touchmove: function(coors){
                if (this.isDrawing) {
                    context.lineTo(coors.x, coors.y);
                    context.stroke();
                }
            },
            touchend: function(coors){
                if (this.isDrawing) {
                    this.touchmove(coors);
                    this.isDrawing = false;
                }
            }
        };

        var border = getBorderSize(); // Initialized just one time
        var r = canvas.getBoundingClientRect();

        alert(JSON.stringify(r));

        // create a function to pass touch events and coordinates to drawer
        function draw(event){
            // get the touch coordinates
            var coors = {
                x: event.targetTouches[0].pageX - r.left - border,
                y: event.targetTouches[0].pageY - r.top - border
            };
            // pass the coordinates to the appropriate handler
            drawer[event.type](coors);
        }


        // attach the touchstart, touchmove, touchend event listeners.
        canvas.addEventListener('touchstart',draw, false);
        canvas.addEventListener('touchmove',draw, false);
        canvas.addEventListener('touchend',draw, false);
        
        // prevent elastic scrolling
        document.body.addEventListener('touchmove',function(event){
            event.preventDefault();
        },false);   // end body.onTouchMove
    }

/*
    canvas.touchstart = function(event) {
        event.preventDefault();

        var touches = event.changedTouches;
        if (touches.length > 0) {
            var touch = touches[0]; // Just pick the first touch
            touchId = touch.identifier;
            var p = {x: touch.pageX, y: touch.pageY};
            startStroke(p.x, p.y);
        }
    };

    canvas.touchmove = function(event) {
        event.preventDefault();

        var touches = event.changedTouches;
        if (touches.length > 0) {
            for (var t = 0; t < touches.length; t++) {
                var touch = touches[t];
                if (touch.identifier === touchId) {
                    var p = {x: touch.pageX, y: touch.pageY};
                    stroke(p.x, p.y);                    
                }
            }
        }
    };

    canvas.touchend = function(event) {
        strokeEnd();
    };

    canvas.touchcancel = function(event) {
        strokeCancel();
    };

    canvas.touchleave = function(event) {
        strokeCancel();
    };
*/

	// With jquery, we can get rid of a lot of this "boilerplate" code

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
	
	var border = getBorderSize(); // Initialized just one time
    

	function getMousePos(event) {
    	if (!event) { event = window.event; } // This is for IE's global window.event
    	
	    var r = canvas.getBoundingClientRect();
    	var coords = {
    		x : event.clientX - r.left - border,
    		y : event.clientY - r.top - border
    	};
    	return coords;
    }
};
