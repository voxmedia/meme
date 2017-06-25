/*
* MemeEditorView
* Manages form capture, model updates, and selection state of the editor form.
*/
MEME.MemeEditorView = Backbone.View.extend({
  initialize: function() {
    this.buildForms();
    this.listenTo(this.model, "change", this.render);
    this.render();
    $(".tab").click(function() {
      $("." + $(this).attr("data-pane")).css(
        "display",
        "block"
      ), $(this).css("border-bottom", "2px solid rgba(76, 78, 77, .2)"), $(this).siblings().css("border-bottom", "2px solid rgba(76, 78, 77, .025)"), $("." + $(this).siblings().attr("data-pane")).css("display", "none");
    });
  },

  // Builds all form options based on model option arrays:
  buildForms: function() {
    var d = this.model.toJSON();

    function buildOptions(opts) {
      return _.reduce(
        opts,
        function(memo, opt) {
          return (memo += [
            '<option value="',
            opt.hasOwnProperty("value") ? opt.value : opt,
            '">',
            opt.hasOwnProperty("text") ? opt.text : opt,
            "</option>"
          ].join(""));
        },
        ""
      );
    }

    if (d.textShadowEdit) {
      $("#text-shadow").parent().show();
    }

    // Build text alignment options:
    if (d.textAlignOpts && d.textAlignOpts.length) {
      $("#text-align").append(buildOptions(d.textAlignOpts)).show();
    }

    // Build font family options:
    if (d.fontFamilyOpts && d.fontFamilyOpts.length) {
      $("#font-family").append(buildOptions(d.fontFamilyOpts)).show();
    }

    // Build font color options:
    if (d.fontColorOpts && d.fontColorOpts.length) {
      var fontOpts = _.reduce(
        d.fontColorOpts,
        function(memo, opt) {
          var color = opt.hasOwnProperty("value") ? opt.value : opt;
          return (memo +=
            '<li><label><input class="m-editor__swatch" style="background-color:' +
            color +
            '" type="radio" name="font-color" value="' +
            color +
            '"></label></li>');
        },
        ""
      );

      $("#font-color").show().find("ul").append(fontOpts);
    }

    // Build watermark options:
    if (d.watermarkOpts && d.watermarkOpts.length) {
      $("#watermark").append(buildOptions(d.watermarkOpts)).show();
    }

    // Build overlay color options:
    if (d.overlayColorOpts && d.overlayColorOpts.length) {
      var overlayOpts = _.reduce(
        d.overlayColorOpts,
        function(memo, opt) {
          var color = opt.hasOwnProperty("value") ? opt.value : opt;
          return (memo +=
            '<li><label><input class="m-editor__swatch" style="background-color:' +
            color +
            '" type="radio" name="overlay" value="' +
            color +
            '"></label></li>');
        },
        ""
      );

      $("#overlay").show().find("ul").append(overlayOpts);
    }

    // Build background color options:
    if (d.backgroundColorOpts && d.backgroundColorOpts.length) {
      var backgroundOpts = _.reduce(
        d.backgroundColorOpts,
        function(memo, opt) {
          var color = opt.hasOwnProperty("value") ? opt.value : opt;
          return (memo +=
            '<li><label><input class="m-editor__swatch" style="background-color:' +
            color +
            '" type="radio" name="background-color" value="' +
            color +
            '"></label></li>');
        },
        ""
      );

      $("#background-color").show().find("ul").append(backgroundOpts);
    }
  },

  render: function() {
    var d = this.model.toJSON();
    this.$("#headline").val(d.headlineText);
    this.$("#credit").val(d.creditText);
    this.$("#watermark").val(d.watermarkSrc);
    this.$("#image-scale").val(d.imageScale);
    this.$("#font-size").val(d.fontSize);
    // this.$("#letter-spacing").val(d.letterSpacing);
    this.$("#font-family").val(d.fontFamily);
    this.$("#font-color")
      .find('[value="' + d.fontColor + '"]')
      .prop("checked", true);
    this.$("#text-align").val(d.textAlign);
    this.$("#text-shadow").prop("checked", d.textShadow);
    this.$("#overlay-alpha").val(d.overlayAlpha);
    this.$("#overlay")
      .find('[value="' + d.overlayColor + '"]')
      .prop("checked", true);
    this.$("#backgroundcolor")
      .find('[value="' + d.backgroundColor + '"]')
      .prop("checked", true);
  },

  events: {
    "input #headline": "onHeadline",
    "input #credit": "onCredit",
    "input #image-scale": "onScale",
    "change #font-size": "onFontSize",
    // "change #letter-spacing": "onLetterSpacing",
    "change #font-family": "onFontFamily",
    'change [name="font-color"]': "onFontColor",
    "change #watermark": "onWatermark",
    "change #text-align": "onTextAlign",
    "change #text-shadow": "onTextShadow",
    "change #overlay-alpha": "onOverlayAlpha",
    'change [name="overlay"]': "onOverlayColor",
    'change [name="background-color"]': "onBackgroundColor",
    "dragover #dropzone": "onZoneOver",
    "dragleave #dropzone": "onZoneOut",
    "drop #dropzone": "onZoneDrop"
  },

  onCredit: function() {
    this.model.set("creditText", this.$("#credit").val());
  },

  onHeadline: function() {
    this.model.set("headlineText", this.$("#headline").val());
  },

  onTextAlign: function() {
    this.model.set("textAlign", this.$("#text-align").val());
  },

  onTextShadow: function() {
    this.model.set("textShadow", this.$("#text-shadow").prop("checked"));
  },

  onFontSize: function() {
    this.model.set("fontSize", this.$("#font-size").val());
  },

  onFontFamily: function() {
    this.model.set("fontFamily", this.$("#font-family").val());
  },

  onFontColor: function(evt) {
    this.model.set("fontColor", this.$(evt.target).val())
  },

  // onLetterSpacing: function() {
  //   this.model.set("letterSpacing", this.$("#letter-spacing").val())
  // },

  onWatermark: function() {
    this.model.set("watermarkSrc", this.$("#watermark").val());
    if (localStorage)
      localStorage.setItem("meme_watermark", this.$("#watermark").val());
  },

  onScale: function() {
    this.model.set("imageScale", this.$("#image-scale").val());
  },

  onOverlayAlpha: function() {
    this.model.set("overlayAlpha", this.$("#overlay-alpha").val());
  },

  onOverlayColor: function(evt) {
    this.model.set("overlayColor", this.$(evt.target).val());
  },

  onBackgroundColor: function(evt) {
    this.model.set("backgroundColor", this.$(evt.target).val());
  },

  getDataTransfer: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return evt.originalEvent.dataTransfer || null;
  },

  onZoneOver: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      dataTransfer.dropEffect = "copy";
      this.$("#dropzone").addClass("pulse");
    }
  },

  onZoneOut: function(evt) {
    this.$("#dropzone").removeClass("pulse");
  },

  onZoneDrop: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      this.model.loadBackground(dataTransfer.files[0]);
      this.$("#dropzone").removeClass("pulse");
    }
  }
});
