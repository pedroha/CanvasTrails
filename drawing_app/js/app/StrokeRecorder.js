/*
 *  StrokeRecorder
 */

var StrokeRecorder = function(userCanvas, brushStyle) {
    var self = this;

	if (!userCanvas) {
		throw new Error("StrokeRecorder(): Missing userCanvas");
	}
	if (!brushStyle) {
		throw new Error("StrokeRecorder(): Missing brushStyle");
	}
    this.userCanvas = userCanvas;
    this.brushStyle = brushStyle;

    self.recording = true;

	var c = userCanvas.getContext('2d');

    this.brush = {
        startStroke: function(x, y) {
            if (self.recording) {
                if (!self.strokeModel) {
                    throw new Error("StrokeRecorder: forgot to setStrokeModel(m)!");
                }
                c.beginPath();
                c.moveTo(x, y);
                self.strokeModel.startStroke(brushStyle);
                self.strokeModel.stroke(x, y);
            }
	    },
        stroke: function(x, y) {
            if (self.recording) {
                c.lineTo(x, y);
                c.stroke();
                self.strokeModel.stroke(x, y);                
            }
        },
        strokeEnd: function() {
            if (self.recording) {
                self.strokeModel.strokeEnd();
            }
        }
    };
}

StrokeRecorder.prototype.setStrokeModel = function(m) {
	this.strokeModel = m;
};

StrokeRecorder.prototype.clearScreen = function() {
    var cnv = this.userCanvas;
    var c = cnv.getContext('2d')

    cnv.width = cnv.width; // Reset the whole canvas

    // Reset last state
    this.brushStyle.applyStyle(c);
};

StrokeRecorder.prototype.init = function() {
	var self = this;
	var canvas = self.userCanvas;
    var border = getCanvasBorderSize(canvas); // Initialized just one time
    var brush = self.brush;

    var getTouchPos = function(event) {
        var coors = null;

        if (event.targetTouches && event.targetTouches[0]) {
            var r = canvas.getBoundingClientRect();
            // get the touch coordinates
            coors = {
                x: event.targetTouches[0].pageX - r.left - border - window.scrollX,
                y: event.targetTouches[0].pageY - r.top - border - window.scrollY
            };
        }
        return coors;
    };

    var getMousePos = function(event) {
        var r = canvas.getBoundingClientRect();
        var coors = {
            x : event.clientX - r.left - border,
            y : event.clientY - r.top - border
        };
        return coors;
    };

    var drawer = {
        isDrawing: false,
        startStroke: function(coors) {
            if (!this.isDrawing) {
                brush.startStroke(coors.x, coors.y);
                brush.stroke(coors.x+1, coors.y+1);
                this.isDrawing = true;
            }
        },
        stroke: function(coors) {
            if (this.isDrawing) {
                brush.stroke(coors.x, coors.y);
            }
        },
        strokeEnd: function(coors){
            if (this.isDrawing) {
                brush.strokeEnd();
                this.isDrawing = false;
            }
        }
    };

    var touchdraw = function(event) {
        var events = {
            'touchstart': 'startStroke'
          , 'touchmove' : 'stroke'
          , 'touchend' : 'strokeEnd'
        }
        if (event.type in events) {
            var coors = getTouchPos(event);
            var action = events[event.type];
            drawer[action](coors);
        }
    };

    var mousedraw = function(event) {
        var events = {
            'mousedown': 'startStroke'
          , 'mousemove': 'stroke'
          , 'mouseup': 'strokeEnd'
        };
        if (event.type in events) {
            var coors = getMousePos(event);
            var action = events[event.type];
            drawer[action](coors); 
        }
    };

    var is_touch = !!('ontouchstart' in window);
    if (is_touch) {
        // attach the touchstart, touchmove, touchend event listeners.
        canvas.addEventListener('touchstart', touchdraw, false);
        canvas.addEventListener('touchmove', touchdraw, false);
        canvas.addEventListener('touchend', touchdraw, false);
    }
    else {
        canvas.addEventListener('mousedown', mousedraw, false);
        canvas.addEventListener('mousemove', mousedraw, false);
        canvas.addEventListener('mouseup', mousedraw, false);        
    }

    function getCanvasBorderSize(canvas) {
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
};
