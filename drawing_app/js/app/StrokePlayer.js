function StrokePlayer(canvas) {
	if (!canvas) {
		throw new Error("StrokePlayer(): Missing canvas param");
	}
	this.canvas = canvas;
}

StrokePlayer.prototype.clear = function() {
	var cnv = this.canvas;

	cnv.width = cnv.width;
};

StrokePlayer.prototype.getDuration = function(strokes, sequential) {
	var time = 0;

	if (sequential) {
		for (var i=0; i<strokes.length; i++) {
			var s = strokes[i];
			time += s.getDuration();
		}
		return time; // Total duration
	}
	else {
		var max_t = 0;
		for (var i=0; i<strokes.length; i++) {
			var s = strokes[i];
			max_t = Math.max(max_t, s.getDuration());
		}
		return max_t;
	}
};

StrokePlayer.prototype.play = function(strokes, sequential, outline) {
	var cnv = this.canvas;
	var c = cnv.getContext('2d');
	var time = 0;

	for (var i=0; i<strokes.length; i++) {
		var s = strokes[i];
		s.replay(c, time, outline);
		if (sequential) {
			time += s.getDuration();
		}
	}
};

StrokePlayer.prototype.snapshot = function(canvas, strokes) {
	var cnv = canvas;
	var c = cnv.getContext('2d');
	c.globalAlpha = 0.3; // Half transparent

	var time = 0;

	for (var i=0; i<strokes.length; i++) {
		var s = strokes[i];
		s.snapshot(c);
	}
};
