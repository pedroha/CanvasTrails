
function Layer(model) {
	EventEmitter.apply(this);

	// Model state: Layer = strokes[] + palette
	this.strokes = [];
	this.palette = [];
	this.sequential = false; // also part of the Layer class		

	if (model) {
		this.restore(model);
	}
	// Transient fields (i.e. not saved)
	this.currentStroke = null;
	this.last = null;
}

Layer.prototype = new EventEmitter();

Layer.prototype.restore = function(model) {
	for (var i = 0; i < model.length; i++) {
		var fullStroke = new FullStroke(model[i].styleState);
		fullStroke.pieces = model[i].pieces;
		this.strokes.push(fullStroke);
	}
};

Layer.prototype.startStroke = function(state) {
	this.currentStroke = new FullStroke(state.clone());
	this.strokes.push(this.currentStroke);
};

Layer.prototype.stroke = function(x, y) {
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

Layer.prototype.strokeEnd = function() {
	var data = this.strokes;
	this.emit("stroke-added", data);
};

Layer.prototype.undoLast = function() {
	this.strokes.pop();
};

Layer.prototype.setDrawEnabled = function(enabled) {
	enabled = (enabled == true);
	var st = this.strokes;
	for (var i = 0; i < st.length; i++) {
		st[i].continueDraw = enabled;
	}
};

