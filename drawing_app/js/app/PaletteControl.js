var PaletteControl = function(domElts, eventType) {
    EventEmitter.apply(this);

    if (!domElts || !eventType) {
        throw new Error("PaletteControl.init() missing arguments.")
    }
    var self = this;

    var select = function(domElt) {
        // Unselect all
        for (var j = 0; j < domElts.length; j++) {
            domElts[j].setAttribute('class', 'color-panel');
        }
        // Select me
        domElt.setAttribute('class', 'color-panel selected');
    };

    this.setPalette = function(palette) {
        self.palette = palette;

        var changeColor = function(e) {
            var color = this.style.backgroundColor;
            var id = this.getAttribute('id');
            var idx = id.substr("color-".length);
            self.emit("color-changed", color, idx);
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

    this.setSelectecColorIdx = function(idx) {
        if (idx < domElts.length) {
            select(domElts[idx]);
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

