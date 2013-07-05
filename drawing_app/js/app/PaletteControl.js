var PaletteControl = function(domElts, eventType) {
    EventEmitter.apply(this);

    if (!domElts || !eventType) {
        throw new Error("PaletteControl.init() missing arguments.")
    }
    var self = this;

    this.setPalette = function(palette) {
        self.palette = palette;

        var select = function(domElt) {
            // Unselect all
            for (var j = 0; j < domElts.length; j++) {
                domElts[j].setAttribute('class', 'color-panel');
            }
            // Select me
            domElt.setAttribute('class', 'color-panel selected');
        };

        var changeColor = function(e) {
            var color = this.style.backgroundColor;
            self.emit("color-changed", color);
            select(this);
        };

        for (var i = 0; i < domElts.length; i++) {
            var elt = domElts[i];
            elt.style.backgroundColor = '#' + palette[i];
            elt.addEventListener(eventType, changeColor, false);
        }
        select(domElts[0]);
    };

    this.getPalette = function() {
        return this.palette;
    }
};

PaletteControl.prototype = new EventEmitter();

var getNewPalette = function() {
    var lucky = Math.floor(Math.random() * PaletteColors.length);
    console.log(PaletteColors[lucky]);
    var palette = PaletteColors[lucky].colors;

    return palette;
};

