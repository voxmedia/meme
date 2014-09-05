MEME.waitForFonts = function(callback) {

  // Parse out fonts list:
  var fonts = this.model.get('fontFamily').split(',');

  // Concat on additional font options:
  fonts = _.map(this.model.get('fontFamilyOpts') || [], function(opt) {
    return opt.hasOwnProperty('value') ? opt.value : opt;
  }).concat(fonts);

  // Filter down to unique fonts list:
  fonts = _.unique(fonts);

  // Setup loader values:
  var deferred = this.$.Deferred();
  var loadedFonts = 0;
  var pendingFonts = [];

  function PendingFont(font) {
    var el = document.createElement('span');
    el.innerHTML = 'giItT1WQy@!-/#';
    el.style.position = 'absolute';
    el.style.left = el.style.top = '-10000px';
    el.style.fontSize = '300px';
    el.style.fontFamily = 'sans-serif';
    el.style.fontVariant = 'normal';
    el.style.fontStyle = 'normal';
    el.style.fontWeight = 'normal';
    el.style.letterSpacing = '0';
    document.body.appendChild(el);

    this.el = el;
    this.sw = el.offsetWidth;
    el.style.fontFamily = font;
  }

  function testFonts() {
    // Schedule next call before assessing outcomes:
    // this makes sure that there's always one delay cycle after element widths have changed.
    if (loadedFonts < pendingFonts.length) {
      setTimeout(testFonts, 50);
    } else {
      deferred.resolve();
      if (typeof callback == 'function') callback();
      return;
    }

    for (var i=0; i < pendingFonts.length; i++) {
      var pending = pendingFonts[i];

      if (pending.el && pending.el.offsetWidth != pending.sw) {
        pending.el.parentNode.removeChild(pending.el);
        pending.el = null;
        loadedFonts++;
      }
    }
  }

  for (var i=0; i < fonts.length; i++) {
    pendingFonts.push(new PendingFont(fonts[i]));
  }
  
  testFonts();
  return deferred.promise();
};