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

    // Candidate display
    if(d.showCandidate) {
      var showCandidate = true;
      var widerText = false;
    }
    else {
      var showCandidate = false;
      var widerText = true;
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
      if(widerText) {
        var maxWidth = Math.round(d.width * 0.925);
      }
      else {
        var maxWidth = Math.round(d.width * 0.625);
      }
      var x = padding;
      var y = padding;

      ctx.font = d.fontSize +'pt '+ d.fontFamily;
      ctx.fillStyle = d.fontColor;
      ctx.textBaseline = 'top';

      // Text shadow:
      if (d.textShadow) {
        ctx.shadowColor = "#333";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 5;
      }

      // Text alignment:
      if (d.textAlign == 'center') {
        ctx.textAlign = 'center';
        x = d.width / 2;
        maxWidth = Math.round(d.width * 0.925);

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
      var startingQuotePlaced = false;

      for (var n = 0; n < words.length; n++) {
        var testLine  = line + words[n] + ' ';
        var metrics   = ctx.measureText( testLine );
        var testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          if(d.quotes && !startingQuotePlaced) {
            ctx.fillText('“', x-26, y);
            startingQuotePlaced = true;
          }
          ctx.fillText(convertQuotes(line), x, y);
          line = words[n] + ' ';
          y += Math.round(d.fontSize * d.leading);
        } else {
          line = testLine;
        }
      }

      if(d.quotes) {
        line = line.trim() + '"';

        if(!startingQuotePlaced) {
          ctx.fillText('“', x-26, y);
          startingQuotePlaced = true;
        }
      }
      ctx.fillText(convertQuotes(line), x, y);
      ctx.shadowColor = 'transparent';
    }

    function renderCredit(ctx) {
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'left';
      ctx.fillStyle = d.fontColor;
      ctx.font = 'normal '+ d.creditSize +'pt '+ d.fontFamily;
      ctx.fillText(d.creditText, padding, d.height - padding);
    }

    function renderBottomText(ctx) {
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'left';
      ctx.fillStyle = d.fontColor;
      ctx.font = 'normal '+d.bottomTextFontSize+'px "FranklinITCProBold"';

      if (d.textShadow) {
        ctx.globalAlpha = d.watermarkAlpha;
        ctx.shadowColor = "#333";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 3;
      }

      // First text
      ctx.fillText(d.bottomText, padding, d.bottomTextVertical*d.height-30);

      // Second text
      var firstTextWidth = ctx.measureText(d.bottomText).width;
      ctx.font = 'normal '+d.bottomTextFontSize+'px "FranklinITCProThin"';
      ctx.fillText(d.bottomText2, firstTextWidth+padding, d.bottomTextVertical*d.height-30);
      ctx.shadowColor = 'transparent';
    }

    function renderNumberText(ctx) {
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillStyle = d.fontColor;
      ctx.font = 'normal 140px "PostoniStandard-Bold_Italic"';

      if (d.textShadow) {
        ctx.globalAlpha = d.watermarkAlpha;
        ctx.shadowColor = "#333";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 5;
      }

      ctx.fillText(d.numberText, padding, d.numberTextVertical*d.height+40);
      ctx.shadowColor = 'transparent';
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

        if (d.textShadow) {
          ctx.globalAlpha = d.watermarkAlpha;
          ctx.shadowColor = "#333";
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.shadowBlur = 3;
        }
        ctx.drawImage(m.watermark, 0, 0, bw, bh, d.width-40-tw, d.height-30-th, tw, th);
        ctx.globalAlpha = 1;
        ctx.shadowColor = 'transparent';
      }
    }

    function renderCandidate(ctx) {
      var source = new Image();
      source.src = d.candidate;
      var h = d.candidateSize;
      source.onload = function(){
        ctx.drawImage(source,d.candidateHorizontal*d.width,d.candidateVertical*d.height,d.candidateRatio*h,h);
        saveData();
      }
    }

    function renderFactChecker(ctx) {
      if(d.factChecker) {
        var type = d.factChecker.charAt(1);
        var count = d.factChecker.charAt(0);
        if(type === 'p') {
          var source = new Image();
          source.src = '../../images/pinocchio.svg';
          source.onload = function(){
            for(var i=0; i<count; i++) {
              ctx.drawImage(source,25+(150*i),d.factCheckerVertical*d.height,200,200);
            }
            saveData();
          }
        }
        else {
          ctx.textBaseline = 'top';
          ctx.textAlign = 'left';
          ctx.fillStyle = d.fontColor;
          ctx.font = 'normal 100px FontAwesome';
          if (d.textShadow) {
            ctx.globalAlpha = d.watermarkAlpha;
            ctx.shadowColor = "#333";
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 5;
          }
          var str = '';
          for(var i=0; i<count; i++) {
            str += '\uf058 ';
          }
          ctx.fillText(str, 60, d.factCheckerVertical*d.height+60);
          ctx.shadowColor = 'transparent';
        }
      }
    }

    var self = this;
    var data = '';
    renderBackground(ctx);
    renderOverlay(ctx);
    renderHeadline(ctx);
    // renderCredit(ctx);
    renderBottomText(ctx);
    renderNumberText(ctx);
    renderWatermark(ctx);
    renderFactChecker(ctx);
    if(showCandidate) { renderCandidate(ctx); }
    saveData();

    function saveData() {
      data = self.canvas.toDataURL(); //.replace('image/png', 'image/octet-stream');
      self.$('#meme-download').attr({
        'href': data,
        'download': 'social_card [' + (new Date()).toString() + '].png'
      });
    }

    // Enable drag cursor while canvas has artwork:
    this.canvas.style.cursor = this.model.background.width ? 'move' : 'default';

    /* Smartquotes conversion
       Copied from https://github.com/kellym/smartquotesjs/blob/master/src/smartquotes.js */
    function convertQuotes(str) {
      return str
        .replace(/'''/g, '\u2034')                                                   // triple prime
        .replace(/(\W|^)"(\S)/g, '$1\u201c$2')                                       // beginning "
        .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2')          // ending "
        .replace(/([^0-9])"/g,'$1\u201d')                                            // remaining " at end of word
        .replace(/''/g, '\u2033')                                                    // double prime
        .replace(/(\W|^)'(\S)/g, '$1\u2018$2')                                       // beginning '
        .replace(/([a-z])'([a-z])/ig, '$1\u2019$2')                                  // conjunction's possession
        .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3')                 // ending '
        .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3')     // abbrev. years like '93
        .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019') // backwards apostrophe
        .replace(/'/g, '\u2032');
    }
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
