function StrokePlayer(trailCanvas) {
	if (!trailCanvas) {
		throw new Error("StrokePlayer(): Missing trailCanvas param");
	}
	this.trailCanvas = trailCanvas;
}

StrokePlayer.prototype.clear = function() {
	var cnv = this.trailCanvas;
	var c = cnv.getContext('2d');

	// Clear all the canvas
	c.beginPath();
	c.rect(0, 0, cnv.width, cnv.height);
	c.fillStyle = "white";
	c.fill();
};

StrokePlayer.prototype.play = function(strokes, concurrent) {
	var cnv = this.trailCanvas;
	var c = cnv.getContext('2d');

	// alert("Strokes #: " + strokes.length);
	var time = 0;

	var sequential = !concurrent;

	if (sequential) {
		for (var i=0; i<strokes.length; i++) {
			var s = strokes[i];
			s.replay(c, time);
			time += s.getDuration();
		}
		return time; // Total duration
	}
	else {
		for (var i=0; i<strokes.length; i++) {
			var s = strokes[i];
			s.replay(c, time);
		}
		var max_t = 0;
		for (var i=0; i<strokes.length; i++) {
			var s = strokes[i];
			max_t = Math.max(max_t, s.getDuration());
		}
		return max_t;
	}
}