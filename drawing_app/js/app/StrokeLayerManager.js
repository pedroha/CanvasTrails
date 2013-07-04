// Clean Replay: copy whole data structure (that's tied up to setTimeout() with a flag)

// Whenever we want to "replay":
//   Cancel previous drawing in progress
//   Recreate a new model and redraw this model

function StrokeLayerManager(strokeRecorder, strokePlayer) {

	var MAX_FRAMES = 4;

	var layerArray = [];
	var currentFrame = 0;

	this.layerArray = layerArray;

	var getCurrentLayerInFrame = function() {
		return layerArray[currentFrame];
	};

	var clearReplayStrokes = function() {
		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(true);
		}

		strokeRecorder.clearScreen();
		var sequential = getSequentialState();

		strokePlayer.clear();

		// Simulate 4 layers of strokes!

		var strokes = getCurrentLayerInFrame().strokes;

		var multiStroke = [];
		multiStroke.push(strokes);
		multiStroke.push(strokes);
		multiStroke.push(strokes);

		// For a single Layer looks good, for multiple layer (not so much)

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

	this.stop = function() {
		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(false);
		}
	};

	this.undoLast = function() {
		// Hack
		layerArray[0].undoLast(); // Undo for all of them ?
		clearReplayStrokes();
	};

	this.resetModel = function(setPalette) {
		var self = this;

		// Cancel current drawing (HACK -> need to cancel all the timers OR use some recursive resumable version)
		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(false);
		}

		for (var i = 0; i < 1; i++) {
			var layer = new Layer();
			layer.on("stroke-added", function(data) {
				clearReplayStrokes();
			});
			layerArray[i] = layer;
		}
		strokeRecorder.setStrokeModel(layerArray[currentFrame]);

		clearReplayStrokes([]);

		if (setPalette) {
			setPalette();
		}
	};

	this.saveModel = function() {
		var name = window.prompt("Enter model title");
		// alert("Saving Model " + name);

		var stringData = JSON.stringify(layerArray[0].strokes);

		localStorage.setItem(name, stringData);



	};

	this.loadModel = function(setPalette) {
		var name = window.prompt("Enter model title");
		// alert("Loading Model " + name);
		
		var stringData = localStorage.getItem(name);
		var model = JSON.parse(stringData);
		console.log(model);

		layerArray[currentFrame] = new Layer(model);

		strokeRecorder.setStrokeModel(layerArray[currentFrame]);

		clearReplayStrokes([]);

		if (setPalette) {
			setPalette();
		}

		// ResetModel() -> Change Palette to the Viewer!
	};
}
