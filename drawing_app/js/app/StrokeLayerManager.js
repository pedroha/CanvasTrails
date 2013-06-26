
function StrokeLayerManager(strokeRecorder, strokePlayer) {

	var MAX_FRAMES = 4;

	var strokeCollectionArray = [];
	var currentFrame = 0;

	var getCurrentStrokeCollectionInFrame = function() {
		return strokeCollectionArray[currentFrame];
	};

	var clearReplayStrokes = function() {

		strokeRecorder.clearScreen();
		var concurrent = getParallelState();
		
		strokePlayer.clear();

		// Simulate 4 layers of strokes!

		var strokes = getCurrentStrokeCollectionInFrame().strokes;

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

		for (var i = 0; i < strokeCollectionArray.length; i++) {
			strokeCollectionArray[i].cancelDraw();
		}

		for (var i = 0; i < MAX_FRAMES; i++) {
			var strokeCollection = new StrokeCollection();
			strokeCollection.on("stroke-added", function(data) {
				clearReplayStrokes();
			});
			strokeCollectionArray[i] = strokeCollection;
		}
		strokeRecorder.setStrokeModel(strokeCollectionArray[0]);

		clearReplayStrokes([]);

		if (callback) {
			callback();
		}
	};
}
