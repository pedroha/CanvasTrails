
//window.onload = function setup() {


	var userCanvasName = "user-drawing";
	var userTrailName = "trail-drawing";

	var userCanvas = document.getElementById(userCanvasName);
	var userContext = userCanvas.getContext("2d");
    
    var trailCanvas = document.getElementById(userTrailName);
	var trailContext = trailCanvas.getContext("2d");

	paletteControl.init(userContext);

	var strokeModel = new StrokeModel();
	var strokePlayer = new StrokePlayer(trailCanvas);

	var strokeRecorder = new StrokeRecorder(userCanvas, paletteControl);

	strokeRecorder.init();
	strokeRecorder.setStrokeModel(strokeModel);

	// alert("onload");

	var clearReplayStrokes = function(strokes) {
		strokeRecorder.clearScreen();
		strokePlayer.paint(strokes);
	};

	strokeModel.on("stroke-added", function(data) {
		clearReplayStrokes(strokeModel.strokes);
	});

//}