/*
* MemeCanvasView
* Manages the creation, rendering, and download of the Meme image.
*/
MEME.MemeCanvasView = Backbone.View.extend({

  initialize: function() {
    var canvas = document.createElement('canvas');
    var $container = MEME.$('#meme-canvas');

    // Display canvas, if enabled:
    if (canvas && canvas.getContext) {
      $container.html(canvas);
      this.canvas = canvas;
      this.setDownload();
      this.render();
    } else {
      $container.html(this.$('noscript').html());
    }

    // Listen to model for changes, and re-render in response:
    this.listenTo(this.model, 'change', this.render);
  },

  setDownload: function() {
    var a = document.createElement('a');
    if (typeof a.download == 'undefined') {
      this.$el.append('<p class="m-canvas__download-note">Right-click button and select "Download Linked File..." to save image.</p>');
    }
  },

  render: function() {
    // Return early if there is no valid canvas to render:
    if (!this.canvas) return;

    // Collect model data:
    var m = this.model;
    var d = this.model.toJSON();
    var ctx = this.canvas.getContext('2d');
    var padding = Math.round(d.width * d.paddingRatio);

    switch(d.template) {
      case 'text_only':
        var showCandidate = false;
        break;
      default:
        var showCandidate = true;
    }

    // Reset canvas display:
    this.canvas.width = d.width;
    this.canvas.height = d.height;
    ctx.clearRect(0, 0, d.width, d.height);

    function renderBackground(ctx) {
      // Base height and width:
      var bh = m.background.height;
      var bw = m.background.width;

      if (bh && bw) {
        // Transformed height and width:
        // Set the base position if null
        var th = bh * d.imageScale;
        var tw = bw * d.imageScale;
        var cx = d.backgroundPosition.x || d.width / 2;
        var cy = d.backgroundPosition.y || d.height / 2;

        ctx.drawImage(m.background, 0, 0, bw, bh, cx-(tw/2), cy-(th/2), tw, th);
      }
    }

    function renderOverlay(ctx) {
      if (d.overlayColor) {
        ctx.save();
        ctx.globalAlpha = d.overlayAlpha;

        switch(d.overlayColor) {
          case 'gradient-left-right':
            var grd=ctx.createLinearGradient(d.width,0,0,0);
            grd.addColorStop(0,"transparent");
            grd.addColorStop(1,"black");
            ctx.fillStyle=grd;
            break;
          case 'gradient-right-left':
            var grd=ctx.createLinearGradient(d.width,0,0,0);
            grd.addColorStop(0,"black");
            grd.addColorStop(1,"transparent");
            ctx.fillStyle=grd;
            break;
          case 'gradient-top-bottom':
            var grd=ctx.createLinearGradient(0,d.height,0,0);
            grd.addColorStop(0,"transparent");
            grd.addColorStop(1,"black");
            ctx.fillStyle=grd;
            break;
            case 'gradient-bottom-top':
            var grd=ctx.createLinearGradient(0,d.height,0,0);
            grd.addColorStop(0,"black");
            grd.addColorStop(1,"transparent");
            ctx.fillStyle=grd;
            break;
          case 'gradient-middle-light-vertical':
            var grd=ctx.createLinearGradient(0,d.height,0,0);
            grd.addColorStop(0,"black");
            grd.addColorStop(0.5,"transparent");
            grd.addColorStop(1,"black");
            ctx.fillStyle=grd;
            break;
          case 'gradient-middle-dark-vertical':
            var grd=ctx.createLinearGradient(0,d.height,0,0);
            grd.addColorStop(0,"transparent");
            grd.addColorStop(0.5,"black");
            grd.addColorStop(1,"transparent");
            ctx.fillStyle=grd;
            break;
          case 'gradient-middle-light-horizontal':
            var grd=ctx.createLinearGradient(d.width,0,0,0);
            grd.addColorStop(0,"black");
            grd.addColorStop(0.5,"transparent");
            grd.addColorStop(1,"black");
            ctx.fillStyle=grd;
            break;
          case 'gradient-middle-dark-horizontal':
            var grd=ctx.createLinearGradient(d.width,0,0,0);
            grd.addColorStop(0,"transparent");
            grd.addColorStop(0.5,"black");
            grd.addColorStop(1,"transparent");
            ctx.fillStyle=grd;
            break;
          default:
            ctx.fillStyle = d.overlayColor;
        }

        ctx.fillRect(0, 0, d.width, d.height);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    function renderHeadline(ctx) {
      var maxWidth = Math.round(d.width * 0.6);
      var x = padding;
      var y = padding;

      ctx.font = d.fontSize +'pt '+ d.fontFamily;
      ctx.fillStyle = d.fontColor;
      ctx.textBaseline = 'top';

      // Text shadow:
      if (d.textShadow) {
        ctx.shadowColor = "#666";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 10;
      }

      // Text alignment:
      if (d.textAlign == 'center') {
        ctx.textAlign = 'center';
        x = d.width / 2;
        maxWidth = d.width * 0.75;

      } else if (d.textAlign == 'right' ) {
        ctx.textAlign = 'right';
        x = d.width - padding + 20;

      } else {
        ctx.textAlign = 'left';
      }

      // Vertical alignment
      y = d.height * d.verticalAlign;

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

    function renderScore(ctx) {
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'left';
      ctx.fillStyle = d.fontColor;
      ctx.font = 'normal 50px FontAwesome';
      var scoreText = '';
      var scorePadding = 0;
      if(d.score) {
        scoreText = d.score == 'up' ? '\uf087' : '\uf088';
        scorePadding = 65;
      }
      ctx.fillText(scoreText, padding, d.height - padding + 3);
      ctx.font = 'normal 40px "FranklinITCProThin"';
      ctx.fillText(d.bottomText, padding + scorePadding, d.height - padding + 7);
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

    function renderFace(ctx) {
      var source = new Image();
      source.src = d.candidate;
      var h = d.candidateSize;
      source.onload = function(){
        ctx.drawImage(source,d.candidateHorizontal*d.width,d.candidateVertical*d.height,d.candidateRatio*h,h);
        saveData();
      }
    }

    var self = this;
    var data = '';
    
    renderBackground(ctx);
    renderOverlay(ctx);
    renderHeadline(ctx);
    renderCredit(ctx);
    renderScore(ctx);
    renderWatermark(ctx);

    if(showCandidate) {
      renderFace(ctx);
    }

    function saveData() {
      data = self.canvas.toDataURL(); //.replace('image/png', 'image/octet-stream');
      self.$('#meme-download').attr({
        'href': data,
        'download': 'social_card [' + (new Date()).toString() + '].png'
      });
    }

    // Enable drag cursor while canvas has artwork:
    this.canvas.style.cursor = this.model.background.width ? 'move' : 'default';
  },

  events: {
    'mousedown canvas': 'onDrag'
  },

  // Performs drag-and-drop on the background image placement:
  onDrag: function(evt) {
    evt.preventDefault();

    // Return early if there is no background image:
    if (!this.model.hasBackground()) return;

    // Configure drag settings:
    var model = this.model;
    var d = model.toJSON();
    var iw = model.background.width * d.imageScale / 2;
    var ih = model.background.height * d.imageScale / 2;
    var origin = {x: evt.clientX, y: evt.clientY};
    var start = d.backgroundPosition;
    start.x = start.x || d.width / 2;
    start.y = start.y || d.height / 2;

    // Create update function with draggable constraints:
    function update(evt) {
      evt.preventDefault();
      model.set('backgroundPosition', {
        x: Math.max(d.width-iw, Math.min(start.x - (origin.x - evt.clientX), iw)),
        y: Math.max(d.height-ih, Math.min(start.y - (origin.y - evt.clientY), ih))
      });
    }

    // Perform drag sequence:
    var $doc = MEME.$(document)
      .on('mousemove.drag', update)
      .on('mouseup.drag', function(evt) {
        $doc.off('mouseup.drag mousemove.drag');
        update(evt);
      });
  }
});
