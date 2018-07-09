'use strict';

(function () {
  var setStyles = function (element, styles) {
    for (var style in styles) {
      if (styles.hasOwnProperty(style)) {
        element.style[style] = styles[style];
      }
    }
  };
  var generateErrorBlock = function (text, styles) {
    var errorElement = document.createElement('div');
    errorElement.innerText = text;
    errorElement.classList.add('error');
    setStyles(errorElement, styles);

    return errorElement;
  };
  var isEscKeyCode = function (keyCode) {
    return keyCode === 27;
  };

  window.utils = {
    'generateErrorBlock': generateErrorBlock,
    'isEscKeyCode': isEscKeyCode,
    'setStyles': setStyles
  };
})();
