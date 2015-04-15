/*
* MemeEditorView
* Manages form capture, model updates, and selection state of the editor form.
*/
MEME.MemeEditorView = Backbone.View.extend({

  initialize: function() {
    this.buildForms();
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  // Builds all form options based on model option arrays:
  buildForms: function() {
    var d = this.model.toJSON();

    function buildOptions(opts) {
      return _.reduce(opts, function(memo, opt) {
        return memo += ['<option value="',
                         opt.hasOwnProperty('value') ? opt.value : opt,
                         '"',
                         opt.hasOwnProperty('selected') ? 'selected="selected"' : '',
                         opt.hasOwnProperty('disabled') ? 'disabled="disabled"' : '',
                         '>',
                         opt.hasOwnProperty('text') ? opt.text : opt,
                         '</option>'].join('');
      }, '');
    }

    if (d.textShadowEdit) {
      $('#text-shadow').parent().show();
    }
    
    // Build aspect ratio options:
    if (d.aspectRatioOpts && d.aspectRatioOpts.length) {
      $('#aspect-ratio').append(buildOptions(d.aspectRatioOpts)).show();
    }    

    // Build background options:
    if (d.backgroundOpts && d.backgroundOpts.length) {
      $('#background').append(buildOptions(d.backgroundOpts)).show();
    }    

    // Build emojis options:
    if (d.emojiOpts && d.emojiOpts.length) {
      $('#emoji-align').append(buildOptions(d.emojiOpts)).show();
    }  
    
    // Build ribbon options:
    if (d.ribbonOpts && d.ribbonOpts.length) {
      $('#ribbon').append(buildOptions(d.ribbonOpts)).show();
    }

    // Build text alignment options:
    if (d.textAlignOpts && d.textAlignOpts.length) {
      $('#text-align').append(buildOptions(d.textAlignOpts)).show();
    }

    // Build font size options:
    if (d.fontSizeOpts && d.fontSizeOpts.length) {
      $('#font-size').append(buildOptions(d.fontSizeOpts)).show();
    }

    // Build font family options:
    if (d.fontFamilyOpts && d.fontFamilyOpts.length) {
      $('#font-family').append(buildOptions(d.fontFamilyOpts)).show();
    }

    // Build watermark options:
    if (d.watermarkOpts && d.watermarkOpts.length) {
      $('#watermark').append(buildOptions(d.watermarkOpts)).show();
    }
    /*
    // Build overlay color options:
    if (d.overlayColorOpts && d.overlayColorOpts.length) {
      var overlayOpts = _.reduce(d.overlayColorOpts, function(memo, opt) {
        var color = opt.hasOwnProperty('value') ? opt.value : opt;
        return memo += '<li><label><input class="m-editor__swatch" style="background-color:'+color+'" type="radio" name="overlay" value="'+color+'"></label></li>';
      }, '');

      $('#overlay').show().find('ul').append(overlayOpts);
    }
    */
   
   this.onAspectRatio();
  },

  render: function() {
    var d = this.model.toJSON();
    this.$('#headline').val(d.headlineText);
    this.$('#credit').val(d.creditText);
    this.$('#watermark').val(d.watermarkSrc);
    this.$('#image-scale').val(d.imageScale);
    this.$('#font-size').val(d.fontSize);
    this.$('#font-family').val(d.fontFamily);
    this.$('#text-align').val(d.textAlign);
    this.$('#text-shadow').prop('checked', d.textShadow);
    //this.$('#overlay').find('[value="'+d.overlayColor+'"]').prop('checked', true);
  },
  
  resetEmoji: function(pos){
    
    if (this.model.attributes.emojiPosition == pos){
      var p = this.model.attributes.textAlign == 'right' ? 0 : 1;
      this.model.set('emojiPosition', p);
      this.$('#emoji-align').find('option').removeAttr('selected').end().val(p);
    }

  },

  events: {
    'input #headline': 'onHeadline',
    'input #credit': 'onCredit',
    'input #image-scale': 'onScale',
    'change #font-size': 'onFontSize',
    'change #font-family': 'onFontFamily',
    'change #watermark': 'onWatermark',
    'change #text-align': 'onTextAlign',
    'change #text-shadow': 'onTextShadow',
    'change [name="overlay"]': 'onOverlayColor',
    'dragover #dropzone': 'onZoneOver',
    'dragleave #dropzone': 'onZoneOut',
    'drop #dropzone': 'onZoneDrop',
    
    'change #aspect-ratio': 'onAspectRatio',
    'change #background': 'onBackground',
    'change #ribbon': 'onRibbon',
    'change [name="emoji"]': 'onEmojiImage',
    'change #emoji-align': 'onEmojiAlign',
  },

  onCredit: function() {
    
    var str = this.$('#credit').val().trim();
    
    if (str == ''){
      this.$('#emoji-align').find('option[value="3"]').removeAttr('disabled');
    } else {
      this.$('#emoji-align').find('option[value="3"]').attr('disabled', 'disabled');
      this.resetEmoji(3);
    }
    
    this.model.set('creditText', str);
  },

  onHeadline: function() {
    this.model.set('headlineText', this.$('#headline').val());
  },

  onTextAlign: function() {
    
    this.$('#emoji-align').find('option[value="1"]').removeAttr('disabled').end()
                          .find('option[value="2"]').removeAttr('disabled');
    
    switch (this.$('#text-align').val()){
      case 'left':
        this.$('#emoji-align').find('option[value="0"]').attr('disabled', 'disabled');
        this.resetEmoji(0);
      break;
      case 'right':
        this.$('#emoji-align').find('option[value="1"]').attr('disabled', 'disabled');
        this.resetEmoji(1);
      break; 
    }
    
    this.model.set('textAlign', this.$('#text-align').val());
  },

  onTextShadow: function() {
    this.model.set('textShadow', this.$('#text-shadow').prop('checked'));
  },

  onFontSize: function() {
    this.model.set('fontSize', this.$('#font-size').val());
  },

  onFontFamily: function() {
    this.model.set('fontFamily', this.$('#font-family').val());
  },

  onWatermark: function() {
    
    if (this.$('#watermark').val() == ''){
      this.$('#emoji-align').find('option[value="2"]').removeAttr('disabled');  
    } else {
      this.$('#emoji-align').find('option[value="2"]').attr('disabled', 'disabled');
      this.resetEmoji(2);
    }    
    
    this.model.set('watermarkSrc', this.$('#watermark').val());
    if (localStorage) localStorage.setItem('meme_watermark', this.$('#watermark').val());
  },
  
  onAspectRatio: function() {
    var wh = this.$('#aspect-ratio').val().split('x');
    
    this.model.set('width', wh[0]);
    this.model.set('height', wh[1]);
    
    this.$('#meme-canvas').attr('class', 'ratio-' + this.$('#aspect-ratio').find(':selected').text().split(' ')[0].toLowerCase());
  },
  
  onBackground: function() {
    this.model.set('backgroundSrc', this.$('#background').val());
    if (localStorage) localStorage.setItem('meme_background', this.$('#background').val());
  },   

  onRibbon: function() {
    this.model.set('ribbon', {
      text: this.$('#ribbon').find(':selected').text(),
      background: this.$('#ribbon').val()
    });
  },
  
  onEmojiImage: function(evt) {
    this.model.set('emoji', this.$(evt.target).val());
  },  
  
  onEmojiAlign: function() {
    this.model.set('emojiPosition', parseInt(this.$('#emoji-align').val(),10));
  },  

  onScale: function() {
    this.model.set('imageScale', this.$('#image-scale').val());
  },

  onOverlayColor: function(evt) {
    this.model.set('overlayColor', this.$(evt.target).val());
  },

  getDataTransfer: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return evt.originalEvent.dataTransfer || null;
  },

  onZoneOver: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      dataTransfer.dropEffect = 'copy';
      this.$('#dropzone').addClass('pulse');
    }
  },

  onZoneOut: function(evt) {
    this.$('#dropzone').removeClass('pulse');
  },

  onZoneDrop: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      this.model.loadBackground(dataTransfer.files[0]);
      this.$('#dropzone').removeClass('pulse');
    }
  }
});