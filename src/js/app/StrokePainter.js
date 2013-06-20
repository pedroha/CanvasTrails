function StrokePlayer(trailCanvas) {
	if (!trailCanvas) {
		throw new Error("StrokePlayer(): Missing trailCanvas param");
	}
	this.trailCanvas = trailCanvas;
}

StrokePlayer.prototype.paint = function(strokes) {
	var c = this.trailCanvas.getContext('2d');

	// Clear all the canvas and replay stroke
	c.beginPath();
	c.rect(0, 0, 600, 400);
	c.fillStyle = "white";
	c.fill();

	// alert("Strokes #: " + strokes.length);

	for (var i=0; i<strokes.length; i++) {
		var s = strokes[i];
		s.replay(c);
	}	
}