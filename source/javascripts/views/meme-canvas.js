/*
* MemeCanvasView
* Manages the creation, rendering, and download of the Meme image.
*/
MEME.MemeCanvasView = Backbone.View.extend({

  initialize: function() {
    var canvas = document.createElement('canvas');
    var $container = $('#meme-canvas');
    var _this = this;

    // Display canvas, if enabled:
    if (canvas && canvas.getContext) {
      $container.html(canvas);
      this.canvas = canvas;
      this.render();
    } else {
      $container.html(this.$('noscript').html());
    }

    // Listen to model for changes, and re-render in response:
    this.listenTo(this.model, 'change', this.render);
    // Allow for moving the background image within the canvas
    $(this.canvas).on('mousedown', function(e) {
      _this.startDrag(e);
    });
    $(document).on('mouseup', function(e) {
      _this.stopDrag(e);
    });
    $(document).on('mousemove', function(e) {
      _this.moveDrag(e);
    });

  },

  render: function() {
    // Return early if there is no valid canvas to render:
    if (!this.canvas) return;

    // Collect model data:
    var m = this.model;
    var d = this.model.toJSON();
    var ctx = this.canvas.getContext('2d');
    var padding = Math.round(d.width * d.paddingRatio);

    // Reset canvas display:
    this.canvas.width = d.width;
    this.canvas.height = d.height;
    ctx.clearRect(0, 0, d.width, d.height);

    function renderBackground(ctx) {
      // Base height and width:
      var bh = m.background.height;
      var bw = m.background.width;

      if (bh && bw) {
        var bp = m.get('backgroundPosition');

        // Transformed height and width:
        // Set the base position if null
        var th = bh * d.imageScale;
        var tw = bw * d.imageScale;
        var cx = bp.x || d.width / 2;
        var cy = bp.y || d.height / 2;

        ctx.drawImage(m.background, 0, 0, bw, bh, cx-(tw/2), cy-(th/2), tw, th);
      }
    }

    function renderOverlay(ctx) {
      if (d.overlayColor) {
        ctx.save();
        ctx.globalAlpha = d.overlayAlpha;
        ctx.fillStyle = d.overlayColor;
        ctx.fillRect(0, 0, d.width, d.height);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    function renderHeadline(ctx) {
      var maxWidth = Math.round(d.width * 0.75);
      var x = padding;
      var y = padding;

      ctx.font = d.fontSize +'pt '+ d.fontFamily;
      ctx.fillStyle = d.fontColor;
      ctx.textBaseline = 'top';

      // Text shadow:
      if (d.textShadow) {
        ctx.shadowColor = "#666";
        ctx.shadowOffsetX = -2;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 10;
      }

      // Text alignment:
      if (d.textAlign == 'center') {
        ctx.textAlign = 'center';
        x = d.width / 2;
        y = d.height - d.height / 1.5;
        maxWidth = d.width - d.width / 3;

      } else if (d.textAlign == 'right' ) {
        ctx.textAlign = 'right';
        x = d.width - padding;

      } else {
        ctx.textAlign = 'left';
      }

      var words = d.headlineText.split(' ');
      var line  = '';

      for (var n = 0; n < words.length; n++) {
        var testLine  = line + words[n] + ' ';
        var metrics   = ctx.measureText( testLine );
        var testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += Math.round(d.fontSize * 1.5);
        } else {
          line = testLine;
        }
      }

      ctx.fillText(line, x, y);
      ctx.shadowColor = 'transparent';
    }

    function renderCredit(ctx) {
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'left';
      ctx.fillStyle = d.fontColor;
      ctx.font = 'normal '+ d.creditSize +'pt '+ d.fontFamily;
      ctx.fillText(d.creditText, padding, d.height - padding);
    }

    function renderWatermark(ctx) {
      // Base & transformed height and width:
      var bw, bh, tw, th;
      bh = th = m.watermark.height;
      bw = tw = m.watermark.width;

      if (bh && bw) {
        // Calculate watermark maximum width:
        var mw = d.width * d.watermarkMaxWidthRatio;

        // Constrain transformed height based on maximum allowed width:
        if (mw < bw) {
          th = bh * (mw / bw);
          tw = mw;
        }

        ctx.globalAlpha = d.watermarkAlpha;
        ctx.drawImage(m.watermark, 0, 0, bw, bh, d.width-padding-tw, d.height-padding-th, tw, th);
        ctx.globalAlpha = 1;
      }
    }

    renderBackground(ctx);
    renderOverlay(ctx);
    renderHeadline(ctx);
    renderCredit(ctx);
    renderWatermark(ctx);

    var data = this.canvas.toDataURL().replace('image/png', 'image/octet-stream');
    this.$('#meme-download').attr({
      'href': data,
      'download': (d.downloadName || 'share') + '.png'
    });
  },

  startDrag: function(e) {

    if (e.button != null && e.button != 0) {
      this._canMove = false;
      return true;
    }

    this._canMove = true;
    $('body').addClass('noselect');

    this._startBG = this.model.get('backgroundPosition');
    this._startPos = { x: e.clientX, y: e.clientY };
    this.canvas.style.cursor = 'move';
  },

  stopDrag: function(e) {
    this._canMove = false;
    $('body').removeClass('noselect');
    this.canvas.style.cursor = 'default';
  },

  moveDrag: function(e) {
    if (typeof(this._canMove) !== "undefined" && this._canMove) {
      var origPos = this._startBG;

      var position = {
        x: origPos.x - (this._startPos.x - e.clientX),
        y: origPos.y - (this._startPos.y - e.clientY)
      };

      this.model.set('backgroundPosition', position);

    }
  }
});
