
//window.onload = function setup() {

	var currentStrokeLayer = 0;


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

	var clearReplayStrokes = function(strokes) {
		strokeRecorder.clearScreen();
		var concurrent = getParallelState();
		strokePlayer.play(strokes, concurrent[0]);
	};

	var strokeRecorder = new StrokeRecorder(userCanvas, currentBrushStyle);
	strokeRecorder.init();

	var strokeCollection;

	var paletteControl = new PaletteControl(domElts);
	
	paletteControl.on("color-changed", function(color) {
		// alert("Color: " + color);
		currentBrushStyle.color = color;
		currentBrushStyle.applyStyle(userContext);
	});

	var resetModel = function() {
		var palette = getNewPalette();
		paletteControl.resetPalette(palette);
		currentBrushStyle.color = palette[0];
		currentBrushStyle.applyStyle(userContext);

		strokeCollection = new StrokeCollection();
		strokeCollection.on("stroke-added", function(data) {
			clearReplayStrokes(strokeCollection.strokes);
		});
		strokeRecorder.setStrokeModel(strokeCollection);

		clearReplayStrokes([]);
	};

	resetModel();

	$('#restartBtn').bind('click', resetModel);

//}



