
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
	    var elt = document.getElementById('color-' + i);
	    domElts.push(elt);
	}

	var cursorEventType = (is_touch) ? "touchstart" : "click"; // Want to get rid of "fastclick.js" (if possible)
	var paletteControl = new PaletteControl(domElts, cursorEventType);

	paletteControl.on("color-changed", function(color, idx) {
		strokeLayerManager.setSelectedColorIdx(idx);
		// alert("Color: " + color);
		currentBrushStyle.color = color;
		currentBrushStyle.applyStyle(userContext);
	});


	var strokePlayer = new StrokePlayer(trailCanvas);

	var strokeRecorder = new StrokeRecorder(userCanvas, currentBrushStyle);
	strokeRecorder.init();

	var strokeLayerManager = new StrokeLayerManager(strokeRecorder, strokePlayer, paletteControl);

	var updateBrush = function() {
		var palette = paletteControl.getPalette();
		currentBrushStyle.color = palette[0];
		currentBrushStyle.applyStyle(userContext);
	};

	var addLayer = function() {
		var layerNum = strokeLayerManager.addLayer(); // which creates a new color palette
		$('#editLayer' + layerNum + 'Btn').attr('disabled', null); // Enable!
		updateBrush();
	};

	var selectLayer = function(evt) {
		strokeLayerManager.selectLayer.call(this);
		updateBrush();
	};

	var resetModel = function() {
		strokeLayerManager.resetModel(); // Set model to empty!

		var palette = paletteControl.getPalette();
		currentBrushStyle.color = palette[0];
		currentBrushStyle.applyStyle(userContext);

		var $checkboxes = $('input[type=checkbox]');
		$checkboxes.prop('checked', false);

		$('.edit-layer').attr('disabled', 'disabled');
		$('#editLayer0Btn').attr('disabled', null);
	};

	resetModel();

	var loadModel = function() {
		strokeLayerManager.loadModel();
		var layerNum = strokeLayerManager.getLayerLength();

		// Enable for these layerNum layers
		for (var i = 0; i < layerNum; i++) {
			$('#editLayer' + i + 'Btn').attr('disabled', null);
		}
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

	$('.edit-layer').bind(cursorEventType, selectLayer);

	$(window).bind('keydown', function(evt) {
		if (evt.keyCode == 32) { // Press space for undo last stroke
			strokeLayerManager.undoLast();
		}
	});

//}
