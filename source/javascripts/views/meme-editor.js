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

    if (d.candidateNewOpts && d.candidateNewOpts.length) {
      $('#candidate-new').append(buildOptions(d.candidateNewOpts)).show();
    }

    if (d.olympicsOpts && d.olympicsOpts.length) {
      $('#olympics').append(buildOptions(d.olympicsOpts)).show();
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

    // Build font color options:
    if (d.fontColorOpts && d.fontColorOpts.length) {
      $('#font-color').append(buildOptions(d.fontColorOpts)).show();
    }

    // Build font size options:
    if (d.fontSizeOpts && d.fontSizeOpts.length) {
      $('#font-size').append(buildOptions(d.fontSizeOpts)).show();
    }

    if (d.bottomTextFontSizeOpts && d.bottomTextFontSizeOpts.length) {
      $('#bottom-text-font-size').append(buildOptions(d.bottomTextFontSizeOpts)).show();
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
      var defaultColors = ['#000000', '#FFFFFF','#ffc20e','#94B0Be', '#c4894f','#00b5bb', '#c7aa53'];
      var overlayOpts = _.reduce(d.overlayColorOpts, function(memo, opt) {
        var color = opt.hasOwnProperty('value') ? opt.value : opt;
        if(defaultColors.indexOf(color) > -1) {
          return memo += '<li><label><input class="m-editor__swatch" style="background-color:'+color+'" type="radio" name="overlay" value="'+color+'"></label></li>';
        }
        else {
          return memo += '<li class="extra-color"><label><input class="m-editor__swatch" style="background-color:'+color+'" type="radio" name="overlay" value="'+color+'"></label></li>';
        }
      }, '');

      $('#overlay').show().find('ul').append(overlayOpts);
    }
  },

  render: function() {
    var d = this.model.toJSON();
    if(d.showCandidateNew) {
      this.$('#show-candidate-new').prop('checked', true)
      this.$('#candidate-section-new').show();
    };
    if(d.showCandidate) {
      this.$('#show-candidate').prop('checked', true)
      this.$('#candidate-section').show();
    };
    if(d.showOlympics) {
      this.$('#show-olympics').prop('checked', true)
      this.$('#olympics-section').show();
    };
    if(d.showLogo) {
      this.$('#show-logo').prop('checked', true)
    };
    if(d.showFactChecker) {
      this.$('#show-fact-checker').prop('checked', true)
      this.$('#fact-checker-section').show();
    };
    this.$('#candidate-new').val(d.candidateNew);
    this.$('#candidate').val(d.candidate);
    this.$('#olympics').val(d.olympics);
    this.$('#candidate-horizontal').val(d.candidateHorizontal);
    this.$('#candidate-new-horizontal').val(d.candidateNewHorizontal);
    this.$('#candidate-vertical').val(d.candidateVertical);
    this.$('#candidate-ratio').val(d.candidateRatio);
    this.$('#fact-checker').val(d.factChecker);
    this.$('#fact-checker-vertical').val(d.factCheckerVertical);
    this.$('#headline').val(d.headlineText);
    this.$('#credit').val(d.creditText);
    this.$('#watermark').val(d.watermarkSrc);
    this.$('#image-scale').val(d.imageScale);
    this.$('#font-color').val(d.fontColor);
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
    this.$('#bottom-text-font-size').val(d.bottomTextFontSize);
    this.$('#bottom-text-vertical').val(d.bottomTextVertical);
    this.$('#number-text').val(d.numberText);
    this.$('#number-text-vertical').val(d.numberTextVertical);
  },

  events: {
    'input #candidate-size': 'onCandidateSize',
    'input #candidate-horizontal': 'onCandidateHorizontal',
    'input #candidate-new-horizontal': 'onCandidateNewHorizontal',
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
    'input #number-text': 'onNumberText',
    'input #number-text-vertical': 'onNumberTextVertical',
    'input #fact-checker-vertical': 'onFactCheckerVertical',
    'change #preset': 'onPreset',
    'change #candidate': 'onCandidate',
    'change #candidate-new': 'onCandidateNew',
    'change #olympics': 'onOlympicsNew',
    'change #fact-checker': 'onFactChecker',
    'change #font-color': 'onFontColor',
    'change #font-size': 'onFontSize',
    'change #bottom-text-font-size': 'onBottomTextFontSize',
    'change #font-family': 'onFontFamily',
    'change #watermark': 'onWatermark',
    'change #text-align': 'onTextAlign',
    'change #text-shadow': 'onTextShadow',
    'change #quotes': 'onQuotes',
    'change [name="overlay"]': 'onOverlayColor',
    'change #show-candidate': 'onShowCandidate',
    'change #show-candidate-new': 'onShowCandidateNew',
    'change #show-olympics': 'onShowOlympics',
    'change #show-logo': 'onShowLogo',
    'change #show-fact-checker': 'onShowFactChecker',
    'click #image-remove': 'onImageRemove',
    'click .editor-section-title': 'toggleEditorSection',
    'dragover #dropzone': 'onZoneOver',
    'dragleave #dropzone': 'onZoneOut',
    'drop #dropzone': 'onZoneDrop'
  },

  onPreset: function() {
    var preset = this.$('#preset').val();
    var m = this.model;

    switch(preset) {

      // Number Card
      case 'number':
        this.model.set('showCandidate', false);
        this.model.set('showCandidateNew', false);
        this.model.set('showOlympics', false);
        this.$('#show-candidate').prop('checked', false);
        this.$('#show-candidate-new').prop('checked', false);
        this.$('#show-olympics').prop('checked', false);
        this.$('#candidate-section').hide();
        this.$('#candidate-section-new').hide();
        this.$('#olympics-section').hide();

        this.model.set('showLogo', true);
        this.$('#show-logo').prop('checked', true);

        this.model.set('fontColor', 'white');

        this.model.set('textShadow', false);
        this.$('#text-shadow').prop('checked', false);

        this.$('.extra-color').show();
        this.model.set('overlayColor', '#004b98');
        this.$('#overlay').find('[value="#004b98"]').prop('checked', true);

        this.model.set('quotes', false);
        this.$('#quotes').prop('checked', false);

        this.model.set('textAlign', 'left');
        this.$('#text-align').val('left');

        this.model.set('verticalAlign', 0.35);
        this.$('#vertical-align').val(0.35);

        this.model.set('fontFamily', 'PostoniStandard-Regular');
        this.$('#font-family').val('PostoniStandard-Regular');

        this.model.set('fontSize', 60);
        this.$('#font-size').val(60);

        this.model.set('leading', 1.65);
        this.$('#leading').val(1.65);

        this.model.set('bottomText', '');
        this.$('#bottom-text').val('');

        this.model.set('bottomText2', 'SOURCE: CREDIT, CREDIT, CREDIT');
        this.$('#bottom-text-2').val('SOURCE: CREDIT, CREDIT, CREDIT');

        this.model.set('bottomTextVertical', 1);
        this.$('#bottom-text-vertical').val(1);

        this.model.set('bottomTextFontSize', 28);
        this.$('#bottom-text-font-size').val(28);

        this.model.set('numberText', '$1.4 million');
        this.$('#number-text').val('$1.4 million');

        this.model.set('numberTextVertical', 0.05);
        this.$('#number-text-vertical').val(0.05);

        this.model.set('factChecker', '');
        this.$('#fact-checker').val('');

        this.model.set('factCheckerVertical', 0.05);
        this.$('#fact-checker-vertical').val(0.05);

        setTimeout(function() {
          m.trigger('change', m);
        }, 250);
        break;

      // Quote Card
      case 'quote':
        this.model.set('showCandidate', false);
        this.model.set('showCandidateNew', false);
        this.model.set('showOlympics', false);
        this.$('#show-candidate').prop('checked', false);
        this.$('#show-candidate-new').prop('checked', false);
        this.$('#show-olympics').prop('checked', false);
        this.$('#candidate-section').hide();
        this.$('#candidate-section-new').hide();
        this.$('#olympics-section').hide();

        this.model.set('showLogo', true);
        this.$('#show-logo').prop('checked', true);

        this.model.set('fontColor', 'white');

        this.model.set('textShadow', false);
        this.$('#text-shadow').prop('checked', false);

        this.$('.extra-color').show();
        this.model.set('overlayColor', '#004b98');
        this.$('#overlay').find('[value="#004b98"]').prop('checked', true);

        this.model.set('quotes', true);
        this.$('#quotes').prop('checked', true);

        this.model.set('textAlign', 'left');
        this.$('#text-align').val('left');

        this.model.set('verticalAlign', 0.1);
        this.$('#vertical-align').val(0.1);

        this.model.set('fontFamily', 'PostoniStandard-Regular');
        this.$('#font-family').val('PostoniStandard-Regular');

        this.model.set('fontSize', 60);
        this.$('#font-size').val(60);

        this.model.set('leading', 1.65);
        this.$('#leading').val(1.65);

        this.model.set('bottomText', 'NAME');
        this.$('#bottom-text').val('NAME');

        this.model.set('bottomText2', ', ATTRIBUTION');
        this.$('#bottom-text-2').val(', ATTRIBUTION');

        this.model.set('bottomTextVertical', 0.92);
        this.$('#bottom-text-vertical').val(0.92);

        this.model.set('bottomTextFontSize', 34);
        this.$('#bottom-text-font-size').val(34);

        this.model.set('numberText', '');
        this.$('#number-text').val('');

        this.model.set('numberTextVertical', 0.05);
        this.$('#number-text-vertical').val(0.05);

        this.model.set('factChecker', '');
        this.$('#fact-checker').val('');

        this.model.set('factCheckerVertical', 0.05);
        this.$('#fact-checker-vertical').val(0.05);

        setTimeout(function() {
          m.trigger('change', m);
        }, 250);
        break;

      // Default
      default:
        this.model.set('showCandidate', false);
        this.model.set('showCandidateNew', true);
        this.model.set('showOlympics', true);
        this.$('#show-candidate').prop('checked', false);
        this.$('#show-candidate-new').prop('checked', true);
        this.$('#show-olympics').prop('checked', true);
        this.$('#candidate-section').hide();
        this.$('#candidate-section-new').show();
        this.$('#olympics-section').show();

        this.model.set('showLogo', false);
        this.$('#show-logo').prop('checked', false);

        this.model.set('fontColor', 'black');

        this.model.set('textShadow', false);
        this.$('#text-shadow').prop('checked', false);

        this.$('.extra-color').hide();
        this.model.set('overlayColor', '#00b5bb');
        this.$('#overlay').find('[value="#00b5bb"]').prop('checked', true);

        this.model.set('candidateSize', 400);
        this.$('#candidate-size').val(400);

        this.model.set('candidateHorizontal', 0.71);
        this.$('#candidate-horizontal').val(0.71);

        this.model.set('candidateNewHorizontal', 0);
        this.$('#candidate-new-horizontal').val(0);

        this.model.set('candidateVertical', 0.125);
        this.$('#candidate-vertical').val(0.125);

        this.model.set('quotes', true);
        this.$('#quotes').prop('checked', true);

        this.model.set('textAlign', 'left');
        this.$('#text-align').val('left');

        this.model.set('verticalAlign', 0.175);
        this.$('#vertical-align').val(0.175);

        this.model.set('fontFamily', 'PostoniStandard-Regular');
        this.$('#font-family').val('PostoniStandard-Regular');

        this.model.set('fontSize', 60);
        this.$('#font-size').val(60);

        this.model.set('leading', 1.5);
        this.$('#leading').val(1.5);

        this.model.set('bottomText', '');
        this.$('#bottom-text').val('');

        this.model.set('bottomText2', '');
        this.$('#bottom-text-2').val('');

        this.model.set('bottomTextVertical', 0.9);
        this.$('#bottom-text-vertical').val(0.9);

        this.model.set('bottomTextFontSize', 34);
        this.$('#bottom-text-font-size').val(34);

        this.model.set('numberText', '');
        this.$('#number-text').val('');

        this.model.set('numberTextVertical', 0.05);
        this.$('#number-text-vertical').val(0.05);

        this.model.set('factChecker', '');
        this.$('#fact-checker').val('');

        this.model.set('factCheckerVertical', 0.05);
        this.$('#fact-checker-vertical').val(0.05);

        setTimeout(function() {
          m.trigger('change', m);
        }, 250);
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

  onShowCandidateNew: function() {
    var checked = this.$('#show-candidate-new').prop('checked');
    if(checked) {
      this.$('#candidate-section-new').show();
    }
    else {
      this.$('#candidate-section-new').hide();
    }
    this.model.set('showCandidateNew', checked);
  },

  onShowOlympics: function() {
    var checked = this.$('#show-olympics').prop('checked');
    if(checked) {
      this.$('#olympics-section').show();
    }
    else {
      this.$('#olympics-section').hide();
    }
    this.model.set('showOlympics', checked);
  },

  onShowLogo: function() {
    var checked = this.$('#show-logo').prop('checked');
    this.model.set('showLogo', checked);
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

  onCandidateNew: function() {
    this.model.set('candidateNew', this.$('#candidate-new').val());
  },

  onOlympics: function() {
    this.model.set('olympics', this.$('#olympics').val());
  },

  onCandidateSize: function() {
    this.model.set('candidateSize', this.$('#candidate-size').val());
  },

  onCandidateHorizontal: function() {
    this.model.set('candidateHorizontal', this.$('#candidate-horizontal').val());
  },

  onCandidateNewHorizontal: function() {
    this.model.set('candidateNewHorizontal', this.$('#candidate-new-horizontal').val());
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

  onFontColor: function() {
    this.model.set('fontColor', this.$('#font-color').val());
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

  onBottomTextFontSize: function() {
    this.model.set('bottomTextFontSize', this.$('#bottom-text-font-size').val());
  },

  onNumberText: function() {
    this.model.set('numberText', this.$('#number-text').val());
  },

  onNumberTextVertical: function() {
    this.model.set('numberTextVertical', this.$('#number-text-vertical').val());
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
