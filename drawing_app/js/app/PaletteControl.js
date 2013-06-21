// TODO: May want to have a function constructor PaletteControl(colorElts[])

var paletteControl = (function() {
	var context;

    // cocurious
    //var palette = ["8B3D2B","D45C22","F7CD44","1E5A56","AFE6D4"];

    // iOS 7
    //var palette = ["2267F2","1BDDF2","3FBF04","F28705","F24738"];


    var lucky = Math.floor(Math.random() * PaletteColors.length);
    console.log(PaletteColors[lucky]);
    var palette = PaletteColors[lucky].colors;
    
    var brushStyles = [];

    for (var i = 0; i < palette.length; i++) {
        var paletteColor = '#' + palette[i];
        var style = new BrushStyle(paletteColor);        
        brushStyles.push(style);
    }
    // alert(brushStyles);
	var currentBrushStyle = brushStyles[4]; // Pick an arbitrary one
	//currentBrushStyle.applyStyle(context);

    var colorElts = [];
    
    for (var i = 0; i < 5; i++) {
        var elt = document.getElementById('color-' + (i+1));
        colorElts.push(elt);
        
        elt.style.backgroundColor = '#' + palette[i];

        elt.onclick = (function(iter) {
            var result = function(e) {
                // alert('got ' + iter);
                currentBrushStyle = brushStyles[iter];

                if (!context) {
                	alert("Missing context");
                }
                currentBrushStyle.applyStyle(context);
                
                // Unselect all
                for (var j = 0; j < colorElts.length; j++) {
                    colorElts[j].setAttribute('class', 'color-panel');
                }
                // Select me
                this.setAttribute('class', 'color-panel selected');
            };
            return result;
        })(i);
    }
    return {
    	init: function(ctx) {
    		context = ctx;
			currentBrushStyle.applyStyle(context);
    	}
    	, reapplyStyle: function() {
			currentBrushStyle.applyStyle(context);
    	}
    	, getCurrentBrush: function() {
    		return currentBrushStyle;
    	}
    };
})();
