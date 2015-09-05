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
        return memo += ['<option value="', opt.hasOwnProperty('value') ? opt.value : opt, '">', opt.hasOwnProperty('text') ? opt.text : opt, '</option>'].join('');
      }, '');
    }

    if (d.candidateOpts && d.candidateOpts.length) {
      $('#candidate').append(buildOptions(d.candidateOpts)).show();
    }

    if (d.factCheckerOpts && d.factCheckerOpts.length) {
      $('#fact-checker').append(buildOptions(d.factCheckerOpts)).show();
    }

    if (d.textShadowEdit) {
      $('#text-shadow').parent().show();
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

    // Build overlay color options:
    if (d.overlayColorOpts && d.overlayColorOpts.length) {
      var overlayOpts = _.reduce(d.overlayColorOpts, function(memo, opt) {
        var color = opt.hasOwnProperty('value') ? opt.value : opt;
        return memo += '<li><label><input class="m-editor__swatch" style="background-color:'+color+'" type="radio" name="overlay" value="'+color+'"></label></li>';
      }, '');

      $('#overlay').show().find('ul').append(overlayOpts);
    }
  },

  render: function() {
    var d = this.model.toJSON();
    if(d.showCandidate) {
      this.$('#show-candidate').prop('checked', true)
      this.$('#candidate-section').show();
    };
    if(d.showFactChecker) {
      this.$('#show-fact-checker').prop('checked', true)
      this.$('#fact-checker-section').show();
    };
    this.$('#candidate').val(d.candidate);
    this.$('#candidate-horizontal').val(d.candidateHorizontal);
    this.$('#candidate-vertical').val(d.candidateVertical);
    this.$('#candidate-ratio').val(d.candidateRatio);
    this.$('#fact-checker').val(d.factChecker);
    this.$('#fact-checker-vertical').val(d.factCheckerVertical);
    this.$('#headline').val(d.headlineText);
    this.$('#credit').val(d.creditText);
    this.$('#watermark').val(d.watermarkSrc);
    this.$('#image-scale').val(d.imageScale);
    this.$('#font-size').val(d.fontSize);
    this.$('#font-family').val(d.fontFamily);
    this.$('#text-align').val(d.textAlign);
    this.$('#vertical-align').val(d.verticalAlign);
    this.$('#leading').val(d.leading);
    this.$('#text-shadow').prop('checked', d.textShadow);
    this.$('#quotes').prop('checked', d.quotes);
    this.$('#overlay').find('[value="'+d.overlayColor+'"]').prop('checked', true);
    this.$('#overlay-opacity').val(d.overlayAlpha);
    this.$('#bottom-text').val(d.bottomText);
    this.$('#bottom-text-2').val(d.bottomText2);
    this.$('#bottom-text-vertical').val(d.bottomTextVertical);
  },

  events: {
    'input #candidate-size': 'onCandidateSize',
    'input #candidate-horizontal': 'onCandidateHorizontal',
    'input #candidate-vertical': 'onCandidateVertical',
    'input #candidate-ratio': 'onCandidateRatio',
    'input #headline': 'onHeadline',
    'input #credit': 'onCredit',
    'input #image-scale': 'onScale',
    'input #vertical-align': 'onVerticalAlign',
    'input #leading': 'onLeading',
    'input #overlay-opacity': 'onOverlayOpacity',
    'input #bottom-text': 'onBottomText',
    'input #bottom-text-2': 'onBottomText2',
    'input #bottom-text-vertical': 'onBottomTextVertical',
    'input #fact-checker-vertical': 'onFactCheckerVertical',
    'change #preset': 'onPreset',
    'change #candidate': 'onCandidate',
    'change #fact-checker': 'onFactChecker',
    'change #font-size': 'onFontSize',
    'change #font-family': 'onFontFamily',
    'change #watermark': 'onWatermark',
    'change #text-align': 'onTextAlign',
    'change #text-shadow': 'onTextShadow',
    'change #quotes': 'onQuotes',
    'change [name="overlay"]': 'onOverlayColor',
    'change #show-candidate': 'onShowCandidate',
    'change #show-fact-checker': 'onShowFactChecker',
    'click #image-remove': 'onImageRemove',
    'click .editor-section-title': 'toggleEditorSection',
    'dragover #dropzone': 'onZoneOver',
    'dragleave #dropzone': 'onZoneOut',
    'drop #dropzone': 'onZoneDrop'
  },

  onPreset: function() {
    var preset = this.$('#preset').val();
    switch(preset) {

      // Quote
      case 'quote':
        this.$('#show-candidate').prop('checked', false);
        this.model.set('showCandidate', false);
        this.$('#candidate-section').hide();

        this.model.set('quotes', true);
        this.$('#quotes').prop('checked', true);

        this.model.set('textAlign', 'left');
        this.$('#text-align').val('left');

        this.model.set('verticalAlign', 0.1);
        this.$('#vertical-align').val(0.1);

        this.model.set('fontFamily', 'PostoniStandard-Regular');
        this.$('#font-family').val('PostoniStandard-Regular');

        this.model.set('fontSize', 50);
        this.$('#font-size').val(50);

        this.model.set('leading', 1.7);
        this.$('#leading').val(1.7);

        this.model.set('overlayColor', '#004b98');
        this.$('#overlay').find('[value="#004b98"]').prop('checked', true);

        this.model.set('bottomTextVertical', 0.93);
        this.$('#bottom-text-vertical').val(0.93);

        break;

      // Default
      default:
        this.$('#show-candidate').prop('checked', true);
        this.model.set('showCandidate', true);
        this.$('#candidate-section').show();

        this.model.set('candidateSize', 400);
        this.$('#candidate-size').val(400);

        this.model.set('candidateHorizontal', 0.715);
        this.$('#candidate-horizontal').val(0.715);

        this.model.set('candidateVertical', 0.125);
        this.$('#candidate-vertical').val(0.125);

        this.model.set('quotes', false);
        this.$('#quotes').prop('checked', false);

        this.model.set('textAlign', 'left');
        this.$('#text-align').val('left');

        this.model.set('verticalAlign', 0.35);
        this.$('#vertical-align').val(0.35);

        this.model.set('fontFamily', 'PostoniStandard-Regular');
        this.$('#font-family').val('PostoniStandard-Regular');

        this.model.set('fontSize', 50);
        this.$('#font-size').val(50);

        this.model.set('leading', 1.6);
        this.$('#leading').val(1.6);

        this.model.set('overlayColor', '#000000');
        this.$('#overlay').find('[value="#000000"]').prop('checked', true);

        this.model.set('bottomTextVertical', 1);
        this.$('#bottom-text-vertical').val(1);
    }
  },

  onShowCandidate: function() {
    var checked = this.$('#show-candidate').prop('checked');
    if(checked) {
      this.$('#candidate-section').show();
    }
    else {
      this.$('#candidate-section').hide();
    }
    this.model.set('showCandidate', checked);
  },

  onShowFactChecker: function() {
    var checked = this.$('#show-fact-checker').prop('checked');
    if(checked) {
      this.$('#fact-checker-section').show();
    }
    else {
      this.$('#fact-checker-section').hide();
    }
    this.model.set('showFactChecker', checked);
  },

  onCandidate: function() {
    this.model.set('candidate', this.$('#candidate').val());
  },

  onCandidateSize: function() {
    this.model.set('candidateSize', this.$('#candidate-size').val());
  },

  onCandidateHorizontal: function() {
    this.model.set('candidateHorizontal', this.$('#candidate-horizontal').val());
  },

  onCandidateVertical: function() {
    this.model.set('candidateVertical', this.$('#candidate-vertical').val());
  },

  onCandidateRatio: function() {
    this.model.set('candidateRatio', this.$('#candidate-ratio').val());
  },

  onCredit: function() {
    this.model.set('creditText', this.$('#credit').val());
  },

  onHeadline: function() {
    this.model.set('headlineText', this.$('#headline').val());
  },

  onTextAlign: function() {
    this.model.set('textAlign', this.$('#text-align').val());
  },

  onVerticalAlign: function() {
    this.model.set('verticalAlign', this.$('#vertical-align').val());
  },

  onLeading: function() {
    this.model.set('leading', this.$('#leading').val());
  },

  onTextShadow: function() {
    this.model.set('textShadow', this.$('#text-shadow').prop('checked'));
  },

  onQuotes: function() {
    this.model.set('quotes', this.$('#quotes').prop('checked'));
  },

  onFactChecker: function() {
    this.model.set('factChecker', this.$('#fact-checker').val());
  },

  onFactCheckerVertical: function() {
    this.model.set('factCheckerVertical', this.$('#fact-checker-vertical').val());
  },

  onFontSize: function() {
    this.model.set('fontSize', this.$('#font-size').val());
  },

  onFontFamily: function() {
    this.model.set('fontFamily', this.$('#font-family').val());
  },

  onWatermark: function() {
    this.model.set('watermarkSrc', this.$('#watermark').val());
    if (localStorage) localStorage.setItem('meme_watermark', this.$('#watermark').val());
  },

  onScale: function() {
    this.model.set('imageScale', this.$('#image-scale').val());
  },

  onOverlayColor: function(evt) {
    this.model.set('overlayColor', this.$(evt.target).val());
  },

  onOverlayOpacity: function() {
    this.model.set('overlayAlpha', this.$('#overlay-opacity').val());
  },

  onBottomText: function() {
    this.model.set('bottomText', this.$('#bottom-text').val());
  },

  onBottomText2: function() {
    this.model.set('bottomText2', this.$('#bottom-text-2').val());
  },

  onBottomTextVertical: function() {
    this.model.set('bottomTextVertical', this.$('#bottom-text-vertical').val());
    console.log(this.$('#bottom-text-vertical').val());
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
  },

  onImageRemove: function(evt) {
    evt.preventDefault();
    this.model.initialize();
  },

  toggleEditorSection: function(evt) {
    var self = $(evt.currentTarget);
    if(self.hasClass('opened')) {
      self.removeClass('opened').addClass('closed');
    }
    else {
      self.removeClass('closed').addClass('opened');
    }
    self.next().slideToggle(250);
  }
});