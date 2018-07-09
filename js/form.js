'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var inputPrice = form.querySelector('#price');
  var inputTimeIn = form.querySelector('#timein');
  var inputTimeOut = form.querySelector('#timeout');
  var inputCapacity = form.querySelector('#capacity');
  var inputCapacityOptions = inputCapacity.querySelectorAll('option');
  var resetButton = form.querySelector('.ad-form__reset');
  var MIN_PRICES_PER_TYPE = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var CAPACITY_PER_ROOM_NUMBER = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var DEFAULT_ATTRS = {
    'mapPinMain': {
      'x': 570,
      'y': 375
    },
    'price': {
      'min': inputPrice.min,
      'placeholder': inputPrice.placeholder
    },
    'room_number': 1
  };

  var onTypeChange = function (type) {
    inputPrice.min = MIN_PRICES_PER_TYPE[type];
    inputPrice.placeholder = MIN_PRICES_PER_TYPE[type];
  };
  var onInputTimeInChange = function (time) {
    inputTimeOut.querySelector('[value="' + time + '"]').selected = 1;
  };
  var onInputTimeOutChange = function (time) {
    inputTimeIn.querySelector('[value="' + time + '"]').selected = 1;
  };
  var onRoomNumberChange = function (roomNumber) {
    for (var i = 0; i < inputCapacityOptions.length; i++) {
      if (CAPACITY_PER_ROOM_NUMBER[roomNumber].indexOf(inputCapacityOptions[i].value) > -1) {
        inputCapacityOptions[i].disabled = false;
      } else {
        inputCapacityOptions[i].disabled = true;
        if (inputCapacityOptions[i].selected) {
          inputCapacityOptions[i].selected = false;
        }
      }
    }
  };
  var mapReset = function () {
    window.map.mapBlock.classList.add('map--faded');
    for (var i = 0; i < window.map.pins.length; i++) {
      window.map.pins[i].classList.add('hidden');
      window.map.cards[i].classList.add('hidden');
    }
  };
  var mapPinMainReset = function () {
    window.map.mapPinMain.style.top = DEFAULT_ATTRS.mapPinMain.y + 'px';
    window.map.mapPinMain.style.left = DEFAULT_ATTRS.mapPinMain.x + 'px';
  };
  var formReset = function () {
    window.map.adFormBlock.classList.add('ad-form--disabled');
    inputPrice.min = DEFAULT_ATTRS.price.min;
    inputPrice.placeholder = DEFAULT_ATTRS.price.placeholder;
    onRoomNumberChange(DEFAULT_ATTRS.room_number);
  };
  var onResetClick = function () {
    mapReset();
    mapPinMainReset();
    formReset();
    window.map.mapIsActive = false;
  };
  var onFormSubmit = function () {
    var formData = new FormData(form);
    var onSuccess = function () {
      var openPopup = function () {
        document.querySelector('.success').classList.remove('hidden');
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onEscPress);
      };
      var closePopup = function () {
        document.querySelector('.success').classList.add('hidden');
        document.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onEscPress);
      };
      var onClick = function () {
        closePopup();
      };
      var onEscPress = function (evt) {
        if (window.utils.isEscKeyCode(evt.keyCode)) {
          closePopup();
        }
      };
      resetButton.click();
      openPopup();
    };
    var onError = function (errorText) {
      var styles = {
        'fontSize': '22px',
        'color': 'red',
        'paddingBottom': '30px'
      };
      var errorElement = window.utils.generateErrorBlock(errorText, styles);

      var onClick = function (evt) {
        if (evt.target.classList.contains('ad-form__reset') || evt.target.classList.contains('ad-form__submit')) {
          removeError();
          window.map.adFormBlock.removeEventListener('click', onClick);
        }
      };
      var removeError = function () {
        var error = window.map.adFormBlock.querySelector('.error');
        window.map.adFormBlock.querySelector('.ad-form__element--submit').removeChild(error);
      };

      window.map.adFormBlock.querySelector('.ad-form__element--submit').insertBefore(errorElement, document.querySelector('.ad-form__submit'));
      window.map.adFormBlock.addEventListener('click', onClick);
    };

    window.document.backend.sendData(formData, onSuccess, onError);
  };

  var HANDLERS = {
    'type': onTypeChange,
    'timein': onInputTimeInChange,
    'timeout': onInputTimeOutChange,
    'room_number': onRoomNumberChange
  };
  form.addEventListener('change', function (evt) {
    var id = evt.target.id;
    if (typeof HANDLERS[id] !== 'undefined') {
      HANDLERS[id](evt.target.value);
    }
  });
  resetButton.addEventListener('click', function () {
    onResetClick();
  });
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    onFormSubmit();
  });
})();
