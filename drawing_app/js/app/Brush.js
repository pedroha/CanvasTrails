//---------------- BrushStyle -----------------------------

function BrushStyle(color, width) {
    this.color = color;
    this.width = width || 18;
    this.lineCap = "round";
    this.lineJoin = "round";
    this.sequential = true; // or parallel
}

BrushStyle.prototype = {
    applyStyle: function(c) {
        c.lineWidth = this.width;
        c.strokeStyle = this.color;
        c.lineCap = this.lineCap;
        c.lineJoin = this.lineJoin;
    },
    toString: function() {
        var state = "{" +
            "color: " + this.color + ", " +
            "width: " + this.width + ", " +
            "lineCap: " + this.lineCap + ", " +
            "lineJoin: " + this.lineJoin +
        "}";
        return state;
    },
    clone: function() {
    	var b = new BrushStyle(this.color);
    	return b;
    }
};
