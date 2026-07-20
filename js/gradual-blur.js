// Vanilla port of React Bits' <GradualBlur /> — no React, no mathjs (the
// source component only ever calls native Math.pow/Math.round).
(function () {
  var CURVE_FUNCTIONS = {
    linear: function (p) { return p; },
    bezier: function (p) { return p * p * (3 - 2 * p); },
    'ease-in': function (p) { return p * p; },
    'ease-out': function (p) { return 1 - Math.pow(1 - p, 2); },
    'ease-in-out': function (p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  };

  function getGradientDirection(position) {
    return { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' }[position] || 'to bottom';
  }

  function createGradualBlur(opts) {
    var config = Object.assign({
      position: 'bottom',
      strength: 2,
      height: '6rem',
      width: null,
      divCount: 5,
      exponential: false,
      zIndex: 1000,
      opacity: 1,
      curve: 'linear',
      target: 'parent',
      parent: document.body,
      className: ''
    }, opts);

    var isVertical = config.position === 'top' || config.position === 'bottom';
    var isPageTarget = config.target === 'page';

    var container = document.createElement('div');
    container.className = 'gradual-blur ' + (isPageTarget ? 'gradual-blur-page' : 'gradual-blur-parent') +
      (config.className ? ' ' + config.className : '');
    container.style.position = isPageTarget ? 'fixed' : 'absolute';
    container.style.pointerEvents = 'none';
    container.style.zIndex = String(isPageTarget ? config.zIndex + 100 : config.zIndex);

    if (isVertical) {
      container.style.height = config.height;
      container.style.width = config.width || '100%';
      container.style[config.position] = '0';
      container.style.left = '0';
      container.style.right = '0';
    } else {
      container.style.width = config.width || config.height;
      container.style.height = '100%';
      container.style[config.position] = '0';
      container.style.top = '0';
      container.style.bottom = '0';
    }

    var inner = document.createElement('div');
    inner.className = 'gradual-blur-inner';
    inner.style.position = 'relative';
    inner.style.width = '100%';
    inner.style.height = '100%';
    container.appendChild(inner);

    var curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;
    var increment = 100 / config.divCount;
    var direction = getGradientDirection(config.position);

    for (var i = 1; i <= config.divCount; i++) {
      var progress = curveFunc(i / config.divCount);
      var blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * config.strength
        : 0.0625 * (progress * config.divCount + 1) * config.strength;

      var p1 = Math.round((increment * i - increment) * 10) / 10;
      var p2 = Math.round(increment * i * 10) / 10;
      var p3 = Math.round((increment * i + increment) * 10) / 10;
      var p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      var gradient = 'transparent ' + p1 + '%, black ' + p2 + '%';
      if (p3 <= 100) gradient += ', black ' + p3 + '%';
      if (p4 <= 100) gradient += ', transparent ' + p4 + '%';

      var layer = document.createElement('div');
      layer.style.position = 'absolute';
      layer.style.inset = '0';
      var maskImage = 'linear-gradient(' + direction + ', ' + gradient + ')';
      layer.style.maskImage = maskImage;
      layer.style.webkitMaskImage = maskImage;
      layer.style.backdropFilter = 'blur(' + blurValue.toFixed(3) + 'rem)';
      layer.style.webkitBackdropFilter = 'blur(' + blurValue.toFixed(3) + 'rem)';
      layer.style.opacity = String(config.opacity);
      inner.appendChild(layer);
    }

    (config.parent || document.body).appendChild(container);
    return container;
  }

  window.createGradualBlur = createGradualBlur;

  // Under the sticky header: extends its frosted-glass edge into a smooth
  // gradual fade instead of a hard cutoff line as content scrolls beneath it.
  // zIndex 50 (+100 for page target = 150) keeps it behind the header (z-index 200).
  createGradualBlur({
    target: 'page',
    position: 'top',
    height: '10rem',
    strength: 2,
    divCount: 6,
    curve: 'bezier',
    zIndex: 50
  });
})();
