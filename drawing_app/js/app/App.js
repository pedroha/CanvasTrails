
//window.onload = function setup() {

	var userCanvasName = "user-drawing";
	var userTrailName = "trail-drawing";

	var userCanvas = document.getElementById(userCanvasName);
	var userContext = userCanvas.getContext("2d");
    
    var trailCanvas = document.getElementById(userTrailName);
	var trailContext = trailCanvas.getContext("2d");

	var currentBrushStyle = new BrushStyle('red');

	var domElts = [];
	for (var i = 0; i < 5; i++) {
	    var elt = document.getElementById('color-' + (i+1));
	    domElts.push(elt);
	}

	var strokePlayer = new StrokePlayer(trailCanvas);


	var strokeRecorder = new StrokeRecorder(userCanvas, currentBrushStyle);
	strokeRecorder.init();

	var strokeLayerManager = new StrokeLayerManager(strokeRecorder, strokePlayer);
	var paletteControl = new PaletteControl(domElts);
	
	paletteControl.on("color-changed", function(color) {
		// alert("Color: " + color);
		currentBrushStyle.color = color;
		currentBrushStyle.applyStyle(userContext);
	});

	var resetModel = function() {
		strokeLayerManager.resetModel(function() {
			var palette = getNewPalette();
			paletteControl.resetPalette(palette);
			currentBrushStyle.color = palette[0];
			currentBrushStyle.applyStyle(userContext);
		});
	};

	resetModel();

	$('#restartBtn').bind('click', resetModel);

//}
