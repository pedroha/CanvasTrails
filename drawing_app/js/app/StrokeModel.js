// (function(environment) {

	function StrokeModel() {
		EventEmitter.apply(this);
		this.strokes = [];
		this.currentStroke = null;
	}

	StrokeModel.prototype = new EventEmitter();

	StrokeModel.prototype.startStroke = function(state) {
		this.currentStroke = new Stroke(state.clone());
		this.strokes.push(this.currentStroke);
		//console.log("StrokeModel.startStroke");
	};

	StrokeModel.prototype.stroke = function(x, y) {
		this.currentStroke.add(x, y);
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


//---------------- STROKE -----------------------------

function Stroke(state) {
	this._startTime = new Date().getTime();
	this.pieces = [];
	this.state = state;
}

Stroke.prototype._getDTime = function() {
		return (new Date().getTime()) - this._startTime;
}

Stroke.prototype.add = function(x, y) {
	this.pieces.push({
		time: this._getDTime(),
		x: x,
		y: y
	});
};

Stroke.prototype.getDuration = function() {
	var duration = 0;
	if (this.pieces.length > 0) {
		// Get the last piece
		var last = this.pieces[this.pieces.length-1];
		duration = last.time;
	}
	return duration;
};

Stroke.prototype.replay = function(context, atWhen) {
	var self = this;

	atWhen = atWhen || 0;

	var brushStyle = new BrushStyle(self.state.color);

	for (var i = 1; i < self.pieces.length; i++) {
		(function(iter) {
			var p = self.pieces[iter];

			setTimeout(function() {		
				var prev = self.pieces[iter-1];

				brushStyle.applyStyle(context);

				context.beginPath();
				context.moveTo(prev.x, prev.y);
				context.lineTo(p.x, p.y);
				context.stroke();
			}, p.time + atWhen);
		})(i);
	}		
};
