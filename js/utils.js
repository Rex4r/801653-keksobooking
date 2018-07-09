'use strict';

(function () {
  var generateErrorBlock = function (text, styles) {
    var errorElement = document.createElement('div');
    errorElement.innerText = text;
    errorElement.classList.add('error');
    for (var style in styles) {
      if (styles.hasOwnProperty(style)) {
        errorElement.style[style] = styles[style];
      }
    }

    return errorElement;
  };
  var isEscKeyCode = function (keyCode) {
    return keyCode === 27;
  };

  window.utils = {
    'generateErrorBlock': generateErrorBlock,
    'isEscKeyCode': isEscKeyCode
  };
})();
