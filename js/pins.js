'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var generatePin = function (data) {
    var pin = pinTemplate.cloneNode(true);
    var pinImg = pin.querySelector('img');

    pin.classList.add('hidden');
    pin.dataset.id = data.id;
    pin.style.left = data.location.x + 'px';
    pin.style.top = data.location.y + 'px';
    pinImg.src = data.author.avatar;
    pinImg.alt = data.offer.title;

    return pin;
  };

  var generatePins = function (data) {
    var mapPins = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var pin = generatePin(data[i]);
      mapPins.appendChild(pin);
    }

    return mapPins;
  };

  window.pins = generatePins(window.data);
})();

