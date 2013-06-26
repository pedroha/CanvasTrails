
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
		var concurrent = getParallelState();
		
		strokePlayer.clear();

		var multiStroke = [];
		multiStroke.push(strokes);
		multiStroke.push(strokes);
		multiStroke.push(strokes);
		multiStroke.push(strokes);

		// Simulate 4 layers of strokes!
/*
		var duration = 0;

		for (var i = 0; i < multiStroke.length; i++) {
			var strokes = multiStroke[i];

			var deferred = $.Deferred();
			setTimeout(deferred.resolve, duration);

			deferred.onsuccess = function() {
				duration = strokePlayer.play(strokes, concurrent[0]); // need "iter" with new scope
			};
		}
*/
		var finishTime = strokePlayer.getDuration(strokes, concurrent[0]);
		strokePlayer.play(strokes, concurrent[0]);

		// Interesting visual "reverb" (when not clearing again)

		setTimeout(function() {
		//	alert("Finished drawing");
			// strokePlayer.clear();
			strokePlayer.play(strokes, concurrent[0]);
		}, finishTime);
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
		if (strokeCollection) {
			strokeCollection.cancelDraw();
		}
		var palette = getNewPalette();
		paletteControl.resetPalette(palette);
		currentBrushStyle.color = palette[0];
		currentBrushStyle.applyStyle(userContext);

		strokeCollection = new StrokeCollection();
		strokeCollection.on("stroke-added", function(data) {
			clearReplayStrokes(this.strokes);
		});
		strokeRecorder.setStrokeModel(strokeCollection);

		clearReplayStrokes([]);
	};

	resetModel();

	$('#restartBtn').bind('click', resetModel);

//}



