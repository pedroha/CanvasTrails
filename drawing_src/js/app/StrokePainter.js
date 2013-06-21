function StrokePlayer(trailCanvas) {
	if (!trailCanvas) {
		throw new Error("StrokePlayer(): Missing trailCanvas param");
	}
	this.trailCanvas = trailCanvas;
}

StrokePlayer.prototype.paint = function(strokes) {
	var cnv = this.trailCanvas;
	var c = cnv.getContext('2d');

	// Clear all the canvas and replay stroke
	c.beginPath();
	c.rect(0, 0, cnv.width, cnv.height);
	c.fillStyle = "white";
	c.fill();

	// alert("Strokes #: " + strokes.length);

	for (var i=0; i<strokes.length; i++) {
		var s = strokes[i];
		s.replay(c);
	}	
}