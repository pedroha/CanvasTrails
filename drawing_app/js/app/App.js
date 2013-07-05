
//window.onload = function setup() {

	var userDrawing = "user-drawing";
	var trailDrawing = "trail-drawing";

	var userCanvas = document.getElementById(userDrawing);
	var userContext = userCanvas.getContext("2d");
    
    var trailCanvas = document.getElementById(trailDrawing);
	var trailContext = trailCanvas.getContext("2d");

	var currentBrushStyle = new BrushStyle('red');

	var domElts = [];
	for (var i = 0; i < 5; i++) {
	    var elt = document.getElementById('color-' + (i+1));
	    domElts.push(elt);
	}

	var cursorEventType = (is_touch) ? "touchstart" : "click"; // Want to get rid of "fastclick.js" (if possible)
	var paletteControl = new PaletteControl(domElts, cursorEventType);

	paletteControl.on("color-changed", function(color) {
		// alert("Color: " + color);
		currentBrushStyle.color = color;
		currentBrushStyle.applyStyle(userContext);
	});


	var strokePlayer = new StrokePlayer(trailCanvas);

	var strokeRecorder = new StrokeRecorder(userCanvas, currentBrushStyle);
	strokeRecorder.init();

	var strokeLayerManager = new StrokeLayerManager(strokeRecorder, strokePlayer, paletteControl);

	var addLayer = function() {
		strokeLayerManager.addLayer(); // which creates a new color palette

		var palette = paletteControl.getPalette();
		currentBrushStyle.color = palette[0];
		currentBrushStyle.applyStyle(userContext);
	};

	var resetModel = function() {
		strokeLayerManager.resetModel(); // Set model to empty!

		var palette = paletteControl.getPalette();
		currentBrushStyle.color = palette[0];
		currentBrushStyle.applyStyle(userContext);

		var $checkboxes = $('input[type=checkbox]');
		$checkboxes.prop('checked', false);
	};

	resetModel();

	var loadModel = function() {
		strokeLayerManager.loadModel();
	};

	$('#restartBtn').bind(cursorEventType, resetModel);
	$('#replayBtn').bind(cursorEventType, strokeLayerManager.replay);
	$('#stopBtn').bind(cursorEventType, strokeLayerManager.stop);
	$('#addLayerBtn').bind(cursorEventType, addLayer);

	// Model
	$('#saveModelBtn').bind(cursorEventType, strokeLayerManager.saveModel);
	$('#loadModelBtn').bind(cursorEventType, loadModel);
	$('#removeModelBtn').bind(cursorEventType, strokeLayerManager.removeModel);
	$('#listModelBtn').bind(cursorEventType, strokeLayerManager.listModels);


	$(window).bind('keydown', function(evt) {
		if (evt.keyCode == 32) { // Press space for undo last stroke
			strokeLayerManager.undoLast();
		}
	});

//}
