'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var generatePin = function (data, num) {
    var pin = pinTemplate.cloneNode(true);
    var pinImg = pin.querySelector('img');

    pin.classList.add('hidden');
    pin.dataset.id = num;
    pin.style.left = data.location.x + 'px';
    pin.style.top = data.location.y + 'px';
    pinImg.src = data.author.avatar;
    pinImg.alt = data.offer.title;

    return pin;
  };

  var generatePins = function (data) {
    var mapPins = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var pin = generatePin(data[i], i);
      mapPins.appendChild(pin);
    }
    if (window.map.mapIsActive === true) {
      var pins = mapPins.querySelectorAll('.map__pin');
      for (i = 0; i < pins.length; i++) {
        pins[i].classList.remove('hidden');
      }
    }

    return mapPins;
  };

  window.pins = generatePins;
})();

