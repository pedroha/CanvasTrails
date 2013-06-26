
function StrokeLayerManager(strokeRecorder, strokePlayer) {

	this.strokeCollection = new StrokeCollection();

	this.clearReplayStrokes = function(strokes) {
		strokeRecorder.clearScreen();
		var concurrent = getParallelState();
		
		strokePlayer.clear();

		// Simulate 4 layers of strokes!

		var multiStroke = [];
		multiStroke.push(strokes);
		multiStroke.push(strokes);
		multiStroke.push(strokes);
		multiStroke.push(strokes);

		var durations = [];
		var totalDuration = 0;
		for (var i = 0; i < multiStroke.length; i++) {
			var strokes = multiStroke[i];
			var dur = strokePlayer.getDuration(strokes, concurrent[i]);
			totalDuration += dur;
			durations.push(dur);
		}

		var timeOffset = 0;
		for (var i = 0; i < multiStroke.length; i++) {
			(function(iter) {
				var strokes = multiStroke[iter];
				setTimeout(function() {
					strokePlayer.play(strokes, concurrent[iter]);
				}, timeOffset);
			})(i);
			timeOffset += durations[i];
		}

		if (0 && totalDuration > 0) { // Quite precise!		
			setTimeout(function() {
				alert("Done");
			}, totalDuration);
		}
	};

	this.resetModel = function(callback) {
		var self = this;

		var strokeCollection = this.strokeCollection;
		if (strokeCollection) {
			strokeCollection.cancelDraw();
		}

		strokeCollection = new StrokeCollection();
		strokeCollection.on("stroke-added", function(data) {
			self.clearReplayStrokes(this.strokes);
		});
		strokeRecorder.setStrokeModel(strokeCollection);

		this.clearReplayStrokes([]);

		this.strokeCollection = strokeCollection;

		if (callback) {
			callback();
		}
	};
}
