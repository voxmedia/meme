var watermark = (location.host).replace(/.*?\.?(.+)\..*?/, '$1');
var watermarks = {
  'mmamania': true,
  'mmafighting': true,
  'bloodyelbow': true
};

watermark = watermarks[watermark] ? watermark : '';


var MEME_SETTINGS = {
  creditText: 'Source:', // Default "credits" text.
  creditSize: 12, // Font size for credit text.
  fontColor: 'white', // Universal font color.
  fontFamily: 'Helvetica', // Default font family selection.
  // Font family options: set to empty array to disable font selector.
  fontFamilyOpts: [],
  fontSize: 24, // Font size of main headline.
  // Font size options: set to empty array to disable font-size selector.
  fontSizeOpts: [14, 24, 36],
  headlineText: 'Write your own headline', // Default headline text.
  height: 378, // Canvas rendering height.
  imageScale: 1, // Background image scale.
  imageSrc: '', // Default background image path. MUST reside on host domain, or use base64 data.
  overlayAlpha: 0.5, // Opacity of image overlay.
  overlayColor: '#000', // Image overlay color, or blank for no overlay.
  // Overlay color options: set to empty array to disable overlay options selector.
  overlayColorOpts: ['#000', '#777', '#d32027'],
  paddingRatio: 0.05, // Percentage of canvas width to use as edge padding.
  textAlign: 'left', // Text alignment.
  // Text alignment options: set to empty array to disable alignment picker.
  textAlignOpts: ['left', 'center', 'right'],
  textShadow: true, // Text shadow.
  textShadowEdit: false, // Toggles text shadow control within the editor.
  watermarkAlpha: 1, // Opacity of watermark image.
  watermarkMaxWidthRatio: 1, // Maximum allowed width of watermark, relative to canvas width.
  watermarkSrc: 'images/'+watermark+'.png', // Watermark image path. MUST reside on host domain, or use base64 data.
  width: 755 // Canvas rendering width.
};