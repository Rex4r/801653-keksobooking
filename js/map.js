'use strict';

(function () {
  window.map = {
    'mapIsActive': false,
    'mapBlock': document.querySelector('.map'),
    'mapPinsBlock': document.querySelector('.map__pins'),
    'mapPinMain': document.querySelector('.map__pin--main'),
    'adFormBlock': document.querySelector('.ad-form'),
    'adFormFieldsets': document.querySelectorAll('fieldset')
  };

  var toggleFieldsetsEnabled = function (arr, status) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = !status;
    }
  };
  var setAddress = function (x, y) {
    window.map.adFormBlock.querySelector('#address').value = Math.round(x) + ', ' + Math.round(y);
  };
  var addListeners = function (pins, cards) {
    for (var i = 0; i < pins.length; i++) {
      addPinListener(pins[i]);
      addCardListener(cards[i]);
    }
  };
  var addPinListener = function (pin) {
    pin.addEventListener('click', function (evt) {
      openPopup(evt.currentTarget.dataset.id);
    });
  };
  var addCardListener = function (card) {
    card.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('popup__close')) {
        closePopup(evt.currentTarget.dataset.id);
      }
    });
  };
  var openPopup = function (id) {
    if (id !== undefined) {
      var cards = window.map.mapBlock.querySelectorAll('.map__card');
      var pins = window.map.mapBlock.querySelectorAll('.map__pin');

      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.add('hidden');
        pins[i + 1].classList.remove('map__pin--active');
      }
      window.map.mapBlock.querySelector('.map__card[data-id="' + id + '"]').classList.remove('hidden');
      window.map.mapBlock.querySelector('.map__pin[data-id="' + id + '"]').classList.add('map__pin--active');
    }
  };
  var closePopup = function (id) {
    if (id !== undefined) {
      window.map.mapBlock.querySelector('.map__card[data-id="' + id + '"]').classList.add('hidden');
      window.map.mapBlock.querySelector('.map__pin[data-id="' + id + '"]').classList.remove('map__pin--active');
    }
  };
  var generateMapContent = function (data) {
    var pins = window.pins(data);
    var cards = window.cards(data);
    window.map.mapPinsBlock.appendChild(pins);
    window.map.mapBlock.insertBefore(cards, document.querySelector('.map__filters-container'));

    window.map.pins = window.map.mapPinsBlock.querySelectorAll('.map__pin.hidden');
    window.map.cards = window.map.mapBlock.querySelectorAll('.map__card');
    addListeners(window.map.pins, window.map.cards);
  };

  var onError = function (errorText) {
    var errorElement = document.createElement('div');
    errorElement.innerText = errorText;
    errorElement.classList.add('error');
    errorElement.style.fontSize = '18px';
    errorElement.style.color = 'red';
    errorElement.style.textAlign = 'center';

    document.querySelector('.promo').appendChild(errorElement);
  };

  window.document.backend.getData(generateMapContent, onError);

  toggleFieldsetsEnabled(window.map.adFormFieldsets, false);

  window.map.mapPinMain.addEventListener('mousedown', function (evt) {
    var dragAndDrop = function () {
      evt.preventDefault();

      var maxX = window.map.mapBlock.offsetWidth - window.map.mapPinMain.offsetWidth;

      var pinPointShift = {
        'x': window.map.mapPinMain.offsetWidth / 2,
        'y': window.map.mapPinMain.offsetHeight + 16
      };

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        var newCoords = {
          'y': window.map.mapPinMain.offsetTop - shift.y,
          'x': window.map.mapPinMain.offsetLeft - shift.x
        };

        if (newCoords.x < 0 || newCoords.x > maxX) {
          newCoords.x = newCoords.x < 0 ? 0 : newCoords.x;
          newCoords.x = newCoords.x > maxX ? maxX : newCoords.x;
        }
        if (newCoords.y < 130 || newCoords.y > 630) {
          newCoords.y = newCoords.y < 130 ? 130 : newCoords.y;
          newCoords.y = newCoords.y > 630 ? 630 : newCoords.y;
        }

        window.map.mapPinMain.style.top = newCoords.y + 'px';
        window.map.mapPinMain.style.left = newCoords.x + 'px';

        setAddress(newCoords.x + pinPointShift.x, newCoords.y + pinPointShift.y);

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        setAddress(window.map.mapPinMain.offsetLeft + pinPointShift.x, window.map.mapPinMain.offsetTop + pinPointShift.y);

        window.map.mapBlock.removeEventListener('mousemove', onMouseMove);
        window.map.mapBlock.removeEventListener('mouseup', onMouseUp);
      };

      window.map.mapBlock.addEventListener('mousemove', onMouseMove);
      window.map.mapBlock.addEventListener('mouseup', onMouseUp);
    };

    dragAndDrop();
    if (!window.map.mapIsActive) {
      window.map.mapBlock.classList.remove('map--faded');
      window.map.adFormBlock.classList.remove('ad-form--disabled');
      toggleFieldsetsEnabled(window.map.adFormFieldsets, true);
      if (typeof window.map.pins !== 'undefined') {
        for (var i = 0; i < window.map.pins.length; i++) {
          window.map.pins[i].classList.remove('hidden');
        }
      }
      window.map.mapIsActive = true;
    }
  });
})();
