var PaletteControl = function(domElts) {
    EventEmitter.apply(this);

    if (!domElts) {
        throw new Error("PaletteControl.init() missing arguments.")
    }

    var self = this;

    this.resetPalette = function(palette) {
        self.palette = palette;

        for (var i = 0; i < domElts.length; i++) {
            var elt = domElts[i];

            elt.style.backgroundColor = '#' + palette[i];

            elt.onclick = function(e) {
                var color = this.style.backgroundColor;
                self.emit("color-changed", color);

                // Unselect all
                for (var j = 0; j < domElts.length; j++) {
                    domElts[j].setAttribute('class', 'color-panel');
                }
                // Select me
                this.setAttribute('class', 'color-panel selected');
            };
        }
    }
};

PaletteControl.prototype = new EventEmitter();

var getNewPalette = function() {
    var lucky = Math.floor(Math.random() * PaletteColors.length);
    console.log(PaletteColors[lucky]);
    var palette = PaletteColors[lucky].colors;

    return palette;
};

