// Clean Replay: copy whole data structure (that's tied up to setTimeout() with a flag)

// Whenever we want to "replay":
//   Cancel previous drawing in progress
//   Recreate a new model and redraw this model

function StrokeLayerManager(strokeRecorder, strokePlayer) {

	var MAX_FRAMES = 4;

	var strokeCollectionArray = [];
	var currentFrame = 0;

	this.strokeCollectionArray = strokeCollectionArray;

	var getCurrentStrokeCollectionInFrame = function() {
		return strokeCollectionArray[currentFrame];
	};

	var clearReplayStrokes = function() {
		for (var i = 0; i < strokeCollectionArray.length; i++) {
			strokeCollectionArray[i].setDrawEnabled(true);
		}

		strokeRecorder.clearScreen();
		var sequential = getSequentialState();

		strokePlayer.clear();

		// Simulate 4 layers of strokes!

		var strokes = getCurrentStrokeCollectionInFrame().strokes;

		var multiStroke = [];
		multiStroke.push(strokes);
		multiStroke.push(strokes);
		multiStroke.push(strokes);
		multiStroke.push(strokes);

		// For a single StrokeCollection looks good, for multiple layer (not so much)

		// timeOffset looks "off"!

		var durations = [];
		var totalDuration = 0;
		for (var i = 0; i < multiStroke.length; i++) {
			var strokes = multiStroke[i];
			var dur = strokePlayer.getDuration(strokes, sequential[i]);
			totalDuration += dur;
			durations.push(dur);
		}

		var timeOffset = 0;
		for (var i = 0; i < multiStroke.length; i++) {

			(function(iter, atWhen) {
				var strokes = multiStroke[iter];

				setTimeout(function() {
					strokePlayer.play(strokes, sequential[iter]);
				}, atWhen);

			})(i, timeOffset);

			timeOffset += durations[i];
		}

		if (0 && totalDuration > 0) { // Quite precise!		
			setTimeout(function() {
				alert("Done");
			}, totalDuration);
		}
	};

	this.replay = clearReplayStrokes;

/*
	var setFrameTimer = function() {

		var TEN_SECS = 10 * 1000; // Alternate frames every 10 seconds

		setTimeout(function() {
			currentFrame = (currentFrame + 1) % MAX_FRAMES;
			
			// We also want to change the palette ??
			strokeRecorder.setStrokeModel(strokeCollectionArray[currentFrame]);

		}, TEN_SECS);
	};
*/
	this.stop = function() {
		for (var i = 0; i < strokeCollectionArray.length; i++) {
			strokeCollectionArray[i].setDrawEnabled(false);
		}
	};

	this.resetModel = function(setPalette) {
		var self = this;

		// Cancel current drawing
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

		strokeRecorder.setStrokeModel(strokeCollectionArray[currentFrame]);
		//setFrameTimer();

		clearReplayStrokes([]);

		if (setPalette) {
			setPalette();
		}
	};
}
