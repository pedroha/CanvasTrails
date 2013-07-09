
function StrokeLayer(model) {
	EventEmitter.apply(this);

	// Model state: StrokeLayer = strokes[] + palette
	this.strokes = [];
	this.palette = [];
	this.selectecColorIdx = 0;

	if (model) {
		this.restore(model);
	}
	// Transient fields (i.e. not saved)
	this.currentStroke = null;
	this.last = null;
}

StrokeLayer.prototype = new EventEmitter();

StrokeLayer.prototype.restore = function(layer) {
	var strokes = layer.strokes;

	for (var i = 0; i < strokes.length; i++) {
		var fullStroke = new FullStroke(strokes[i].styleState);
		fullStroke.pieces = strokes[i].pieces;
		this.strokes.push(fullStroke);
	}
	this.palette = layer.palette;
	this.selectedColorIdx = layer.selectedColorIdx;
};

StrokeLayer.prototype.startStroke = function(state) {
	this.currentStroke = new FullStroke(state.clone());
	this.strokes.push(this.currentStroke);
};

StrokeLayer.prototype.stroke = function(x, y) {
	var valid = true;

	var last = this.last;
	if (last) {
		valid = (Math.abs(last.x - x ) < 100) && (Math.abs(last.y - y) < 100);
	}
	if (valid) {
		this.currentStroke.add(x, y);
	}
	this.last = {x: x, y: y};
};

StrokeLayer.prototype.strokeEnd = function() {
	var data = this.strokes;
	this.emit("stroke-added", data);
};

StrokeLayer.prototype.undoLast = function() {
	this.strokes.pop();
};

StrokeLayer.prototype.setDrawEnabled = function(enabled) {
	enabled = (enabled == true);
	var st = this.strokes;
	for (var i = 0; i < st.length; i++) {
		st[i].continueDraw = enabled;
	}
};

