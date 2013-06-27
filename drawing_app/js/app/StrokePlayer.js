function StrokePlayer(trailCanvas) {
	if (!trailCanvas) {
		throw new Error("StrokePlayer(): Missing trailCanvas param");
	}
	this.trailCanvas = trailCanvas;
}

StrokePlayer.prototype.clear = function() {
	var cnv = this.trailCanvas;

	cnv.width = cnv.width; // This should do!

	/*
	var c = cnv.getContext('2d');

	// Clear all the canvas
	c.beginPath();
	c.rect(0, 0, cnv.width, cnv.height);
	c.fillStyle = "white";
	c.fill();
	*/
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
}

StrokePlayer.prototype.play = function(strokes, sequential) {
	var cnv = this.trailCanvas;
	var c = cnv.getContext('2d');
	var time = 0;

	for (var i=0; i<strokes.length; i++) {
		var s = strokes[i];
		s.replay(c, time);
		if (sequential) {
			time += s.getDuration();
		}
	}
}
