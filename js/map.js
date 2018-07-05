'use strict';

(function () {
  document.map = {
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
    document.map.adFormBlock.querySelector('#address').value = Math.round(x) + ', ' + Math.round(y);
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
      var cards = document.map.mapBlock.querySelectorAll('.map__card');
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.add('hidden');
      }
      document.map.mapBlock.querySelector('.map__card[data-id="' + id + '"]').classList.remove('hidden');
    }
  };
  var closePopup = function (id) {
    if (id !== undefined) {
      document.map.mapBlock.querySelector('.map__card[data-id="' + id + '"]').classList.add('hidden');
    }
  };

  document.map.mapPinsBlock.appendChild(window.pins);
  document.map.mapBlock.insertBefore(window.cards, document.querySelector('.map__filters-container'));

  document.map.pins = document.map.mapPinsBlock.querySelectorAll('.map__pin.hidden');
  document.map.cards = document.map.mapBlock.querySelectorAll('.map__card');
  addListeners(document.map.pins, document.map.cards);

  toggleFieldsetsEnabled(document.map.adFormFieldsets, false);

  document.map.mapPinMain.addEventListener('mousedown', function (evt) {
    var dragAndDrop = function () {
      evt.preventDefault();

      var maxX = document.map.mapBlock.offsetWidth - document.map.mapPinMain.offsetWidth;

      var pinPointShift = {
        'x': document.map.mapPinMain.offsetWidth / 2,
        'y': document.map.mapPinMain.offsetHeight + 16
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
          'y': document.map.mapPinMain.offsetTop - shift.y,
          'x': document.map.mapPinMain.offsetLeft - shift.x
        };

        if (newCoords.x < 0 || newCoords.x > maxX) {
          newCoords.x = newCoords.x < 0 ? 0 : newCoords.x;
          newCoords.x = newCoords.x > maxX ? maxX : newCoords.x;
        }
        if (newCoords.y < 130 || newCoords.y > 630) {
          newCoords.y = newCoords.y < 130 ? 130 : newCoords.y;
          newCoords.y = newCoords.y > 630 ? 630 : newCoords.y;
        }

        document.map.mapPinMain.style.top = newCoords.y + 'px';
        document.map.mapPinMain.style.left = newCoords.x + 'px';

        setAddress(newCoords.x + pinPointShift.x, newCoords.y + pinPointShift.y);

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        setAddress(document.map.mapPinMain.offsetLeft + pinPointShift.x, document.map.mapPinMain.offsetTop + pinPointShift.y);

        document.map.mapBlock.removeEventListener('mousemove', onMouseMove);
        document.map.mapBlock.removeEventListener('mouseup', onMouseUp);
      };

      document.map.mapBlock.addEventListener('mousemove', onMouseMove);
      document.map.mapBlock.addEventListener('mouseup', onMouseUp);
    };

    dragAndDrop();
    if (!document.map.mapIsActive) {
      document.map.mapBlock.classList.remove('map--faded');
      document.map.adFormBlock.classList.remove('ad-form--disabled');
      toggleFieldsetsEnabled(document.map.adFormFieldsets, true);
      for (var i = 0; i < document.map.pins.length; i++) {
        document.map.pins[i].classList.remove('hidden');
      }
      document.map.mapIsActive = true;
    }
  });
})();
