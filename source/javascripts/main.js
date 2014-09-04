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
  }
};

jQuery(function() {
  MEME.init();
});