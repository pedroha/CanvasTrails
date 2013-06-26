
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

	var clearReplayStrokes = function(strokes) {
		strokeRecorder.clearScreen();
		strokePlayer.paint(strokes);
	};

	var strokeRecorder = new StrokeRecorder(userCanvas, currentBrushStyle);
	strokeRecorder.init();

	var strokeModel;

	var paletteControl = new PaletteControl(domElts);
	
	paletteControl.on("color-changed", function(color) {
		// alert("Color: " + color);

		currentBrushStyle.color = color;

		var context = userContext;
		if (!context) {
		    alert("Missing context");
		}
		else {
		    currentBrushStyle.applyStyle(context);
		}
	});

	var resetModel = function() {
		var palette = getNewPalette();
		paletteControl.resetPalette(palette);

		strokeModel = new StrokeModel();
		strokeModel.on("stroke-added", function(data) {
			clearReplayStrokes(strokeModel.strokes);
		});
		strokeRecorder.setStrokeModel(strokeModel);

		clearReplayStrokes([]);
	};

	resetModel();

	$('#restartBtn').bind('click', resetModel);

//}



