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
      //this.setDownload();
      this.render();
    } else {
      $container.html(this.$('noscript').html());
    }

    // Listen to model for changes, and re-render in response:
    this.listenTo(this.model, 'change', this.render);
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
      if (d.backgroundOpt == '') {
        return;
      }
          
      ctx.save();
      ctx.globalCompositeOperation="destination-over";
      //console.log(ctx.createPattern(m.backgroundOpt,"repeat"))
      try {
        ctx.fillStyle = ctx.createPattern(m.backgroundOpt,"repeat");
        ctx.fillRect(0, 0, d.width, d.height);
        ctx.restore();
        
      }catch(err) {}

    }

    function renderImage(ctx) {
      // Base height and width:
      var bh = m.background.height;
      var bw = m.background.width;
      
      if (bh && bw) {
        // Transformed height and width:
        // Set the base position if null
        var th = bh * d.imageScale;
        var tw = bw * d.imageScale;
        //Use position or center
        d.backgroundPosition.x = d.backgroundPosition.x || (d.width / 2) - (bw / 2);
        d.backgroundPosition.y = d.backgroundPosition.y || (d.height / 2) - (bh / 2);
        
        ctx.drawImage(m.background, 0, 0, bw, bh, d.backgroundPosition.x, d.backgroundPosition.y, tw, th);
        
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
      
      
      ctx.font =  d.fontSize +'px '+ d.fontFamily;

      ctx.fillStyle = d.fontColor;
      ctx.textBaseline = 'top';

      // Text shadow:
      if (d.textShadow) {
        ctx.shadowColor = "rgba(0,0,0, .5)";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 4;
      }

      // Text alignment:
      if (d.textAlign == 'center') {
        ctx.textAlign = 'center';
        x = d.width / 2;
        //y = d.height - d.height / 1.5;
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
      ctx.font = 'normal '+ d.creditSize +'pt museo-300';
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
    
    function renderRibbon(ctx){
      
      if (d.ribbon.background == '' || d.aspectRatio != '970x545'){
        return;
      }
            
      var h = 120;

      //Rectangulo 
      ctx.globalCompositeOperation="source-over";
      ctx.fillStyle=d.ribbon.background;
      ctx.fillRect(0, ((d.height / 2) - (h / 2)), d.width, h);
      
      //Texto
      if (d.ribbon.text == 'Alerta meteorológica') {
        ctx.font = 'normal 60px museo-sans-900';  
      } else {
        ctx.font = 'normal 84px museo-sans-900';
      }
      
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';      
      ctx.fillStyle = d.fontColor;
      
      //sombra
      ctx.shadowColor = "rgba(0,0,0, .5)";
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.shadowBlur = 4;  
      
      ctx.fillText(d.ribbon.text.toUpperCase(), d.width / 2, (d.height / 2) + 8 );
      ctx.shadowColor = 'transparent';
    }
    
    function renderEmoji(ctx){
      if (d.emoji == ''){
        return;
      }
      
      var x = padding,
          y = padding,
          mw = d.width * d.emojiMaxWidthRatio,// Calculate watermark maximum width:
          efinal = d.emojiSize;
          
      // Constrain transformed height based on maximum allowed width:
      if (mw < d.emojiSize) {
        efinal = d.emojiSize * (mw / d.emojiSize);
      }            
                
      switch (d.emojiPosition){
        case 0:
          x = padding;
          y = padding;         
        break;
        case 1:
          x = d.width - efinal - padding;
          y = padding;              
        break;
        case 2:
          x = d.width - efinal - padding;
          y = d.height - efinal - padding;              
        break;
        case 3:
          x = padding;
          y = d.height - efinal - padding;              
        break;
      }
      
      ctx.drawImage(m.emoji,
                    d.emojiSize * d.emoji, 0, d.emojiSize, d.emojiSize,
                    x, y, efinal, efinal);
      
      
    }

    renderBackground(ctx);
    renderImage(ctx);
    renderOverlay(ctx);
    renderHeadline(ctx);
    renderCredit(ctx);
    renderWatermark(ctx);
    renderRibbon(ctx);
    renderEmoji(ctx);
    
    this.model.canvas = this.canvas;//.toDataURL("image/jpeg", .80); //.replace('image/png', 'image/octet-stream');
    // Enable drag cursor while canvas has artwork:
    this.canvas.style.cursor = this.model.background.width ? 'move' : 'default';
  },
  
  events: {
    'mousedown canvas': 'onDrag',
    'touchstart canvas': 'onDrag',
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
    var origin = {x: evt.clientX || evt.originalEvent.touches[0].clientX,
                  y: evt.clientY || evt.originalEvent.touches[0].clientY};
    var start = d.backgroundPosition;
    start.x = start.x || (d.width / 2) - (iw / 2);
    start.y = start.y || (d.height / 2) - (ih / 2);
    
    // Create update function with draggable constraints:
    function update(evt) {
      
      evt.preventDefault();
      
      if (evt.type == 'touchend') {
        return;
      }
      
      model.set('backgroundPosition', {
        x: start.x - (origin.x - (evt.clientX || evt.originalEvent.touches[0].clientX) ),
        y: start.y - (origin.y - (evt.clientY || evt.originalEvent.touches[0].clientY) )
      });
      
      /*
      model.set('backgroundPosition', {
        x: Math.max(d.width-iw, Math.min(start.x - (origin.x - evt.clientX), iw)),
        y: Math.max(d.height-ih, Math.min(start.y - (origin.y - evt.clientY), ih))
      });
      */
    }
    
    //alert(evt.type)

    // Perform drag sequence:
    var $doc = MEME.$(document)
      .on('mousemove.drag touchmove.drag', update)
      .on('mouseup.drag touchend.drag', function(evt) {
        $doc.off('mouseup.drag mousemove.drag touchmove.drag touchend.drag');
        update(evt);
      });
  } 
});
