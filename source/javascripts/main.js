MEME = {
  $: jQuery,

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

    // Re-render view after all fonts load:
    this.waitForFonts().then(function() {
      MEME.render();
    });
  }
};

MEME.$(function() {
  MEME.init();
  
  if ($.cookie('tns01')) {
    $('#user-image').find('.small-avatar')
        .removeAttr('data-original')
        .attr('src', $.parseJSON($.cookie('tns01')).image);
  }
  
  $('canvas').addClass('animate');
});