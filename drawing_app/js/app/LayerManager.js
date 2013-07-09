// Clean Replay: copy whole data structure (that's tied up to setTimeout() with a flag)

// Whenever we want to "replay":
//   Cancel previous drawing in progress
//   Recreate a new model and redraw this model

function StrokeLayerManager(strokeRecorder, strokePlayer, paletteControl) {

	var MAX_FRAMES = 4;

	var layerArray = [];

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

		this.addLayer();
	};

	this.addLayer = function() {

		var layer = new StrokeLayer();
		layer.palette = getNewPalette();
		paletteControl.setPalette(layer.palette);

		layer.on("stroke-added", function(data) {
			clearReplayStrokes();
		});
		layerArray.push(layer);

		strokeRecorder.setStrokeModel(layer);

		clearReplayStrokes([]);
	};


	// ------------- LocalStorage persistence --------------------------

	var WORK_PREFIX = "W-";

	var getWorkName = function(name) { return WORK_PREFIX + name; };

	this.saveModel = function() {
		var name = window.prompt("Enter model title");

		if (name) {
			// alert("Saving Model " + name);

			var stringData = JSON.stringify(layerArray);
			var wname = getWorkName(name);
			localStorage.setItem( wname, stringData);		
		}
	};

	this.loadModel = function() {
		// Cancel current drawing (HACK -> need to cancel all the timers OR use some recursive resumable version)
		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(false);
		}

		var name = window.prompt("Enter model title");

		if (name) {
			// alert("Loading Model " + name);

			var wname = getWorkName(name);
			var stringData = localStorage.getItem(wname);
			if (!stringData) {
				alert("Work not found: " + name);
				return;
			}
			var model = JSON.parse(stringData);
			console.log(model);

			layerArray = []; // Reset

			for (var i = 0; i < model.length; i++) {
				var layer = new StrokeLayer(model[i]);

				layer.on("stroke-added", function(data) {
					clearReplayStrokes();
				});
				layerArray.push(layer);
			}

			// Restore last layer model and last palette
			strokeRecorder.setStrokeModel(layer);
			paletteControl.setPalette(layer.palette);

			clearReplayStrokes([]);	
		}
	};

	this.removeModel = function() {
		var name = window.prompt("Enter model title");
		if (name) {
			alert("Removing Model " + name);

			var wname = getWorkName(name);
			localStorage.removeItem(wname);			
		}
	};

	this.listModels = function() {
		var works = [];
		for (var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			var work = localStorage.getItem(key);

			if (key && key.indexOf(WORK_PREFIX) === 0) {
				key = key.substr(WORK_PREFIX.length);
				works.push(key);
			}
		}
		alert("Models: " + works);
	};
}

var browseLocalStorage = function() {
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		var work = localStorage.getItem(key);
		console.log(key, work);
	}
};

// localStorage.clear();

