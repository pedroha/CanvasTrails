// (function(environment) {

	function StrokeModel() {
		EventEmitter.apply(this);
		this.strokes = [];
		this.currentStroke = null;
	}

	StrokeModel.prototype = new EventEmitter();

	StrokeModel.prototype.startStroke = function(x, y, state) {
		this.currentStroke = new Stroke(x, y, state);
		this.strokes.push(this.currentStroke);
		//console.log("StrokeModel.startStroke");
	};

	StrokeModel.prototype.stroke = function(x, y, state) {
		this.currentStroke.add(x, y, state);
		//console.log("StrokeModel.stroke");
	};

	StrokeModel.prototype.strokeEnd = function() {
		var data = this.strokes;
		this.emit("stroke-added", data);
		//console.log("StrokeModel.strokeEnd");
	};

	StrokeModel.prototype.cancelStroke = function() {
		this.strokes.pop();
		this.currentStroke = null;
	}

//	environment.StrokeModel = StrokeModel;
//})(this);


//---------------- BrushStyle -----------------------------

function BrushStyle(color, width) {
    this.color = color;
    this.width = width || 18;
    this.lineCap = "round";
    this.lineJoin = "round";
}

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

//---------------- STROKE -----------------------------

function Stroke(x, y, state) {
	this._startTime = new Date().getTime();
	this.pieces = [];
	this.add(x, y, state);
}

Stroke.prototype._getDTime = function() {
		return (new Date().getTime()) - this._startTime;
}

Stroke.prototype.add = function(x, y, state) {
	this.pieces.push({
		time: this._getDTime(),
		x: x,
		y: y,
		state: state
	});
};

Stroke.prototype.replay = function(context) {
	var self = this;

	for (var i = 1; i < self.pieces.length; i++) {
		(function(iter) {
			var p = self.pieces[iter];

			setTimeout(function() {		
				var prev = self.pieces[iter-1];

				var paintState = p.state;
				paintState.applyStyle(context);

				context.beginPath();
				context.moveTo(prev.x, prev.y);
				context.lineTo(p.x, p.y);
				context.stroke();
			}, p.time);
		})(i);
	}
};
