/*
* MemeModel
* Manages rendering parameters and source image datas.
*/
MEME.MemeModel = Backbone.Model.extend({
  defaults: {
    backgroundOpt: '',
    backgroundOpts: [],
    backgroundPosition: { x: null, y: null },
    creditText: 'Source:',
    creditSize: 12,
    downloadName: 'share',
    emoji: '',
    emojiImage: '',
    emojiPosition: '',
    emojiSize: '',
    fontColor: 'white',
    fontFamily: 'Helvetica Neue',
    fontFamilyOpts: ['Helvetica', 'Helvetica Neue', 'Comic Sans MS'],
    fontSize: 24,
    fontSizeOpts: [14, 24, 36],
    headlineText: 'Write your own headline',
    height: 378,
    imageScale: 1,
    imageSrc: '',
    overlayAlpha: 0.5,
    //overlayColor: '#000',
    //overlayColorOpts: ['#000', '#777', '#2980b9'],
    paddingRatio: 0.05,
    ribbon: {
      text:'',
      background: ''
    },
    ribbonOpts: [],
    textAlign: 'left',
    textAlignOpts: ['left', 'center', 'right'],
    textShadow: true,
    textShadowEdit: true,
    watermarkAlpha: 0.75,
    watermarkMaxWidthRatio: 0.25,
    watermarkSrc: '',
    watermarkOpts: [],
    width: 755
  },

  // Initialize with custom image members used for background and watermark:
  // These images will (sort of) behave like managed model fields.
  initialize: function() {
    var emo = (this.attributes.emojiImage || this.defaults.emojiImage);
    
    this.background = new Image();
    this.backgroundOpt = new Image();
    this.watermark = new Image();
    this.emoji = new Image();
    
    if (emo != '') {
      this.emoji.src = emo;  
    }

    // Set image sources to trigger "change" whenever they reload:
    this.background.onload = this.watermark.onload = this.backgroundOpt.onload = _.bind(function() {
      this.trigger('change');
    }, this);

    // Set initial image and watermark sources:
    if (this.get('imageSrc')) this.background.src = this.get('imageSrc');
    if (this.get('watermarkSrc')) this.setWatermarkSrc(this.get('watermarkSrc'));
    if (this.get('backgroundOpt')) this.backgroundOpt = this.get('backgroundOpt');

    // Update image and watermark sources if new source URLs are set:
    this.listenTo(this, 'change:imageSrc', function() {
      this.background.src = this.get('imageSrc');
    });
    this.listenTo(this, 'change:watermarkSrc', function() {
      this.setWatermarkSrc(this.get('watermarkSrc'));
    });
    this.listenTo(this, 'change:backgroundOpt', function() {
      this.setBackgroundOpt(this.get('backgroundOpt'));
    });    
  },
  
  canvas: null,

  // Specifies if the background image currently has data:
  hasBackground: function() {
    return this.background.width && this.background.height;
  },

  // Loads a file stream into an image object:
  loadFileForImage: function(file, image) {
    var reader = new FileReader();
    reader.onload = function() { image.src = reader.result; };
    reader.readAsDataURL(file);
  },

  // Loads a file reference into the background image data source:
  loadBackground: function(file) {
    this.loadFileForImage(file, this.background);
    this.attributes.backgroundPosition.x = null;
    this.attributes.backgroundPosition.y = null;
  },

  // Loads a file reference into the watermark image data source:
  loadWatermark: function(file) {
    this.loadFileForImage(file, this.watermark);
  },
  
  // When setting a new watermark "src",
  // this method looks through watermark options and finds the matching option.
  // The option's "data" attribute will be set as the watermark, if defined.
  // This is useful for avoiding cross-origin resource loading issues.
  setBackgroundOpt: function(src) {
    var opt = _.findWhere(this.get('backgroundOpt'), {value: src});
    var data = (opt && opt.data) || src;

    // Toggle cross-origin attribute for Data URI requests:
    if (data.indexOf('data:') === 0) {
      this.backgroundOpt.removeAttribute('crossorigin');
    } else {
      this.backgroundOpt.setAttribute('crossorigin', 'anonymous');
    }
    
    this.backgroundOpt.src = data;
    this.set('backgroundOpt', src);
  },

  // When setting a new watermark "src",
  // this method looks through watermark options and finds the matching option.
  // The option's "data" attribute will be set as the watermark, if defined.
  // This is useful for avoiding cross-origin resource loading issues.
  setWatermarkSrc: function(src) {
    var opt = _.findWhere(this.get('watermarkOpts'), {value: src});
    var data = (opt && opt.data) || src;

    // Toggle cross-origin attribute for Data URI requests:
    if (data.indexOf('data:') === 0) {
      this.watermark.removeAttribute('crossorigin');
    } else {
      this.watermark.setAttribute('crossorigin', 'anonymous');
    }
    
    this.watermark.src = data;
    this.set('watermarkSrc', src);
  }
});
