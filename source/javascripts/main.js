function waitForFonts(fonts, callback) {
    var loadedFonts = 0;
    var pendingFonts = [];

    function PendingFont(font) {
        var el = document.createElement('span');
        el.innerHTML = 'giItT1WQy@!-/#';
        el.style.position = 'absolute';
        el.style.left = el.style.top = '-10000px';
        el.style.visibility = 'hidden';
        el.style.fontSize = '300px';
        el.style.fontFamily = 'sans-serif';
        el.style.fontVariant = 'normal';
        el.style.fontStyle = 'normal';
        el.style.fontWeight = 'normal';
        el.style.letterSpacing = '0';
        document.body.appendChild(el);

        this.el = el;
        this.sw = el.offsetWidth;
        el.style.fontFamily = font;
    }

    function testFonts() {
        for (var i=0; i < pendingFonts.length; ++i) {
            var pending = pendingFonts[i];
            if (pending.el && pending.el.offsetWidth != pending.sw) {
                pending.el.parentNode.removeChild(pending.el);
                pending.el = null;
                loadedFonts++;
            }
        }

        if (loadedFonts < pendingFonts.length) {
            setTimeout(testFonts, 50);
        } else if (typeof callback == 'function') {
            callback();
        }
    }

    for (var i=0; i < fonts.length; i++) {
        pendingFonts.push(new PendingFont(fonts[i]));
    }
    testFonts();
}

MEME = {
  render: function() {
    this.canvas && this.canvas.render();
  },

  init: function() {
    this.model = new this.MemeModel(window.MEME_SETTINGS || {});

    // Create renderer view:
    this.canvas = new this.MemeCanvasView({
      el: '#meme-canvas-view',
      model: this.model
    });

    // Create editor view:
    this.editor = new this.MemeEditorView({
      el: '#meme-editor-view',
      model: this.model
    });

    // Parse out fonts list:
    var fontsList = this.model.get('fontFamily').split(',');
    fontsList = fontsList.concat(this.model.get('fontFamilyOpts') || []);

    // Re-render view after all fonts load:
    waitForFonts(fontsList, function() {
      MEME.render();
    });
  }
};

jQuery(function() {
  MEME.init();
});