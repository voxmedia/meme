/*
* MemeModel
* Manages rendering parameters and source image datas.
*/
MEME.MemeModel = Backbone.Model.extend({
  defaults: {
    creditText: 'Source:',
    creditSize: 12,
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
    overlayColor: '#000',
    overlayColorOpts: ['#000', '#777', '#2980b9'],
    paddingRatio: 0.05,
    textAlign: 'left',
    textAlignOpts: ['left', 'center', 'right'],
    textShadow: true,
    textShadowEdit: true,
    watermarkAlpha: 0.75,
    watermarkMaxWidthRatio: 0.20,
    watermarkSrc: '',
    watermarkOpts: [],
    width: 755
  },

  // Initialize with custom image members used for background and watermark:
  // These images will (sort of) behave like managed model fields.
  initialize: function() {
    this.background = new Image();
    this.watermark = new Image();

    // Configure for cross-origin requests:
    //background.setAttribute('crossOrigin', 'anonymous');
    //watermark.setAttribute('crossOrigin', 'anonymous');

    // Set image sources to trigger "change" whenever they reload:
    this.background.onload = this.watermark.onload = _.bind(function() {
      this.trigger('change');
    }, this);

    // Set initial image and watermark sources:
    if (this.get('imageSrc')) this.background.src = this.get('imageSrc');
    if (this.get('watermarkSrc')) this.setWatermarkSrc(this.get('watermarkSrc'));

    // Update image and watermark sources if new source URLs are set:
    this.listenTo(this, 'change:imageSrc', function() {
      this.background.src = this.get('imageSrc');
    });
    this.listenTo(this, 'change:watermarkSrc', function() {
      this.setWatermarkSrc(this.get('watermarkSrc'));
    });
  },

  loadFileForImage: function(file, image) {
    var reader = new FileReader();
    reader.onload = function() { image.src = reader.result; };
    reader.readAsDataURL(file);
  },

  loadBackground: function(file) {
    this.loadFileForImage(file, this.background);
  },

  loadWatermark: function(file) {
    this.loadFileForImage(file, this.watermark);
  },

  setWatermarkSrc: function(src) {
    var option = _.findWhere(this.get('watermarkOpts'), {value: src});
    this.watermark.src = (option && option.data) || src;
  }
});