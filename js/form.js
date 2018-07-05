'use strict';

(function validation() {
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
    document.map.mapBlock.classList.add('map--faded');
    for (var i = 0; i < document.map.pins.length; i++) {
      document.map.pins[i].classList.add('hidden');
      document.map.cards[i].classList.add('hidden');
    }
  };
  var mapPinMainReset = function () {
    document.map.mapPinMain.style.top = DEFAULT_ATTRS.mapPinMain.y + 'px';
    document.map.mapPinMain.style.left = DEFAULT_ATTRS.mapPinMain.x + 'px';
  };
  var formReset = function () {
    document.map.adFormBlock.classList.add('ad-form--disabled');
    inputPrice.min = DEFAULT_ATTRS.price.min;
    inputPrice.placeholder = DEFAULT_ATTRS.price.placeholder;
    onRoomNumberChange(DEFAULT_ATTRS.room_number);
  };
  var onResetClick = function () {
    mapReset();
    mapPinMainReset();
    formReset();
    document.map.mapIsActive = false;
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
})();
