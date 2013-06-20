
//window.onload = function setup() {
	var userCanvas = document.getElementById("user-drawing");
	var userContext = userCanvas.getContext("2d");
    
    var trailCanvas = document.getElementById("trail-drawing");
	var trailContext = trailCanvas.getContext("2d");

	paletteControl.init(userContext);

	var strokeModel = new StrokeModel();
	var strokePlayer = new StrokePlayer(trailCanvas);

	var strokeRecorder = new StrokeRecorder(userCanvas, paletteControl);

	strokeRecorder.init();
	strokeRecorder.setStrokeModel(strokeModel);

	// alert("onload");

	strokeModel.on("stroke-added", function clearReplayStrokes(strokes) {
		//var strokes = evt.data;
		strokeRecorder.clearScreen();
		strokePlayer.paint(strokes);
	});
//}