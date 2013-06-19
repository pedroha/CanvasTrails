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
}

StrokeRecorder.prototype.init = function() {
	var self = this;
	var canvas = self.userCanvas;
    var drawing = false;

    canvas.onmousedown = function(event) {
    	var p = getMousePos(event);
        self.brush.startStroke(p.x, p.y);
        drawing = true;
    };

    canvas.onmousemove = function(event) {
    	var p = getMousePos(event);
        if (drawing) {
            self.brush.stroke(p.x, p.y);
        }
    };

    canvas.onmouseup = function(event) {
        drawing = false;
        self.brush.strokeEnd();
	};

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
