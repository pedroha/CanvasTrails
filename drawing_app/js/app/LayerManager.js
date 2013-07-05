// Clean Replay: copy whole data structure (that's tied up to setTimeout() with a flag)

// Whenever we want to "replay":
//   Cancel previous drawing in progress
//   Recreate a new model and redraw this model

function StrokeLayerManager(strokeRecorder, strokePlayer, paletteControl) {

	var MAX_FRAMES = 4;

	var layerArray = [];
	var currentFrame = 0;


	var clearReplayStrokes = function() {
		//alert(layerArray.length);

		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(true);
		}

		strokeRecorder.clearScreen();
		var sequential = getSequentialState();

		strokePlayer.clear();

		var durations = [];
		var totalDuration = 0;
		for (var i = 0; i < layerArray.length; i++) {
			var strokes = layerArray[i].strokes;
			var dur = strokePlayer.getDuration(strokes, sequential[i]);
			totalDuration += dur;
			durations.push(dur);
		}
		console.log(durations);

		var timeOffset = 0;
		for (var i = 0; i < layerArray.length; i++) {

			(function(iter, atWhen) {

				var layer = layerArray[iter];
				var strokes = layer.strokes;
				//var palette = layer.palette;
				//paletteControl.setPalette(palette);

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

	var cancelDrawing = function() {
		// Cancel current drawing (HACK -> need to cancel all the timers OR use some recursive resumable version)
		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(false);
		}		
	};

	this.resetModel = function() {
		var self = this;

		cancelDrawing();

		layerArray = [];
		currentFrame = 0;

		this.addLayer();
	};

	this.addLayer = function() {

		var layer = new Layer();
		layer.palette = getNewPalette();
		paletteControl.setPalette(layer.palette);

		layer.on("stroke-added", function(data) {
			clearReplayStrokes();
		});
		layerArray.push(layer);

		strokeRecorder.setStrokeModel(layerArray[currentFrame]);
		currentFrame++;

		clearReplayStrokes([]);
	};


	// ------------- LocalStorage persistence --------------------------

	var LIST_NAME = "CanvasModels";

	this.saveModel = function() {
		var name = window.prompt("Enter model title");
		// alert("Saving Model " + name);

		var stringData = JSON.stringify(layerArray);
		localStorage.setItem(name, stringData);

		var names = localStorage.getItem(LIST_NAME);
		if (names && names !== "null") {
			// BUG: duplicate names
			var elts = JSON.parse(names); // to array
			if (elts.indexOf(name) < 0) {
				elts.push(name);
			}
		}
		else {
			var elts = [name];
		}
		var eltStr = JSON.stringify(elts);
		localStorage.setItem(LIST_NAME, eltStr);
	};

	this.loadModel = function() {
		// Cancel current drawing (HACK -> need to cancel all the timers OR use some recursive resumable version)
		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(false);
		}

		var name = window.prompt("Enter model title");
		// alert("Loading Model " + name);
		
		var stringData = localStorage.getItem(name);
		var model = JSON.parse(stringData);
		console.log(model);

		layerArray = []; // Reset

		for (var i = 0; i < model.length; i++) {
			var layer = new Layer(model[i]);

			layer.on("stroke-added", function(data) {
				clearReplayStrokes();
			});
			layerArray.push(layer);
		}

		// Continue with last layer (or create a new layer?)
		strokeRecorder.setStrokeModel(layer);

		clearReplayStrokes([]);
	};

	this.removeModel = function() {
		var name = window.prompt("Enter model title");
		alert("Removing Model " + name);

		localStorage.removeItem(name);

		var names = localStorage.getItem(LIST_NAME);
		if (names && names != "null") {
			var elts = JSON.parse(names); // to array
			var idx = elts.indexOf(name);
			elts.splice(idx, 1);

			var strElts = JSON.stringify(elts);
			localStorage.setItem(LIST_NAME, strElts);
		}
	};

	this.listModels = function() {
		var names = localStorage.getItem(LIST_NAME);
		alert("Models: " + names);
	};
}
