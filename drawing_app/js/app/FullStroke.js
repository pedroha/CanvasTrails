//---------------- STROKE -----------------------------

function FullStroke(styleState) {
	this.pieces = [];
	this.styleState = styleState;
	this.continueDraw = true;
	this._startTime = new Date().getTime();
}

FullStroke.prototype._getDTime = function() {
	var offsetFromStart = (new Date().getTime()) - this._startTime;
	return offsetFromStart;
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

