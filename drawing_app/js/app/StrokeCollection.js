// (function(environment) {

function StrokeCollection() {
	EventEmitter.apply(this);
	this.strokes = [];
	this.currentStroke = null;
	this.last = null;
}

StrokeCollection.prototype = new EventEmitter();

StrokeCollection.prototype.startStroke = function(state) {
	this.currentStroke = new FullStroke(state.clone());
	this.strokes.push(this.currentStroke);
};

StrokeCollection.prototype.stroke = function(x, y) {
	var valid = true;

	var last = this.last;
	if (last) {
		valid = (Math.abs(last.x - x ) < 100) && (Math.abs(last.y - y) < 100);
	}
	if (valid) {
		this.currentStroke.add(x, y);
	}
	this.last = {x: x, y: y};
};

StrokeCollection.prototype.strokeEnd = function() {
	var data = this.strokes;
	this.emit("stroke-added", data);
};

StrokeCollection.prototype.undoLast = function() {
	this.strokes.pop();
};

StrokeCollection.prototype.setDrawEnabled = function(enabled) {
	enabled = (enabled == true);
	var st = this.strokes;
	for (var i = 0; i < st.length; i++) {
		st[i].continueDraw = enabled;
	}
};


//	environment.StrokeCollection = StrokeCollection;
//})(this);

//---------------- STROKE -----------------------------

function FullStroke(styleState) {
	this.pieces = [];
	this.styleState = styleState;
	this.continueDraw = true;
	this._startTime = new Date().getTime();
}

FullStroke.prototype._getDTime = function() {
	return (new Date().getTime()) - this._startTime;
}

FullStroke.prototype.add = function(x, y) {
	this.pieces.push({
		time: this._getDTime(),
		x: x,
		y: y
	});
};

FullStroke.prototype.getDuration = function() {
	var duration = 0;
	if (this.pieces.length > 0) {
		// Get the last piece
		var last = this.pieces[this.pieces.length-1];
		duration = last.time;
	}
	return duration;
};

FullStroke.prototype.replay = function(context, atWhen) {
	var self = this;

	atWhen = atWhen || 0;

	var brushStyle = new BrushStyle(self.styleState.color);

	for (var i = 1; i < self.pieces.length; i++) {
		(function(iter) {
			var p = self.pieces[iter];

			setTimeout(function() {
				if (self.continueDraw) {
					var prev = self.pieces[iter-1];

					brushStyle.applyStyle(context);

					context.beginPath();
					context.moveTo(prev.x, prev.y);
					context.lineTo(p.x, p.y);
					context.stroke();
				}
			}, p.time + atWhen);
		})(i);
	}		
};

