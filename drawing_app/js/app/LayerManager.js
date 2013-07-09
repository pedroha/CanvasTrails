// Clean Replay: copy whole data structure (that's tied up to setTimeout() with a flag)

// Whenever we want to "replay":
//   Cancel previous drawing in progress
//   Recreate a new model and redraw this model

var testAddLayer = true;

function StrokeLayerManager(strokeRecorder, strokePlayer, paletteControl) {

	var MAX_FRAMES = 4;

	var layerArray = [];
	var selectedLayerIdx = 0;

	var clearReplayStrokes = function() {
		//alert(layerArray.length);

		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(true);
		}
		var cnv = document.getElementById('trail-stacked');
		cnv.width = cnv.width; // clear trail-stacked

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

	if (!testAddLayer) {
		var clearReplayStrokesInCurrentLayer = clearReplayStrokes;
	}
	else {
		var clearReplayStrokesInCurrentLayer = function() {
			strokeRecorder.clearScreen();

			strokePlayer.clear();

			var sequential = getSequentialState();
			var layer = layerArray[selectedLayerIdx];
			var strokes = layer.strokes;
			strokePlayer.play(strokes, sequential[selectedLayerIdx]);
		};

	}
	this.replay = clearReplayStrokes;

	this.stop = function() {
		for (var i = 0; i < layerArray.length; i++) {
			layerArray[i].setDrawEnabled(false);
		}
	};

	this.undoLast = function() {
		// Hack
		layerArray[0].undoLast(); // Undo for all of them ?
		clearReplayStrokesInCurrentLayer();
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
		var MAX_LAYERS = 5;

		if (layerArray.length < MAX_LAYERS) {
			if (testAddLayer) {
				// Get a snapshot of the previous frames
				var cnv = document.getElementById('trail-stacked');
				cnv.width = cnv.width; // clear trail-stacked
				//var ctx = cnv.getContext('2d');
				for (var i = 0; i < layerArray.length; i++) {
					var strokes = layerArray[i].strokes;
					strokePlayer.snapshot(cnv, strokes);
				}
			}

			var layer = new StrokeLayer();
			layer.palette = getNewPalette();
			paletteControl.setPalette(layer.palette);

			layer.on("stroke-added", function(data) {
				clearReplayStrokesInCurrentLayer();
			});
			layerArray.push(layer);

			strokeRecorder.setStrokeModel(layer);

			clearReplayStrokesInCurrentLayer();
			//clearReplayStrokes(); // No need to replay
		}
		else {
			alert("We reached the maximum number of layers!");
		}
		selectedLayerIdx = layerArray.length-1;
		return selectedLayerIdx;
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
					clearReplayStrokesInCurrentLayer();
				});
				layerArray.push(layer);
			}
			// Restore last layer model and last palette
			strokeRecorder.setStrokeModel(layer);
			paletteControl.setPalette(layer.palette);

			clearReplayStrokes();	
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

	this.selectLayer = function() {
		var id = $(this).attr('id');
		var i = id.indexOf('Btn');
		var digit = id.substr(i-1, 1); // This ony works for a single digit
		// alert("Selecting layer #" + digit);

		selectedLayerIdx = digit;
		var layer = layerArray[digit];

		strokeRecorder.setStrokeModel(layer);
		paletteControl.setPalette(layer.palette);
		paletteControl.setSelectecColorIdx(layer.selectedColorIdx);

		if (testAddLayer) {
			// Get a snapshot of the previous frames
			var cnv = document.getElementById('trail-stacked');
			cnv.width = cnv.width; // clear trail-stacked
			for (var i = 0; i < selectedLayerIdx; i++) {
				var strokes = layerArray[i].strokes;
				strokePlayer.snapshot(cnv, strokes);
			}
		}
		clearReplayStrokesInCurrentLayer();
	};

	this.setSelectedColorIdx = function(idx) {
		layerArray[selectedLayerIdx].selectedColorIdx = Number(idx);
	}

	this.getLayerLength = function() {
		return layerArray.length;
	}
}

var browseLocalStorage = function() {
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		var work = localStorage.getItem(key);
		console.log(key, work);
	}
};

// localStorage.clear();

