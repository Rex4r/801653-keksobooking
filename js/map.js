'use strict';
(function () {
  var mapIsActive = false;
  var mapBlock = document.querySelector('.map');
  var mapPinsBlock = document.querySelector('.map__pins');
  var mapPinMain = mapPinsBlock.querySelector('.map__pin--main');
  var adFormBlock = document.querySelector('.ad-form');
  var adFormFieldsets = adFormBlock.querySelectorAll('fieldset');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var adsData = (function () {
    var ads = [];
    var mapWidth = document.querySelector('.map').offsetWidth;
    var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
    var TYPES = ['palace', 'flat', 'house', 'bungalo'];
    var TIME = ['12:00', '13:00', '14:00'];
    var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

    var generateFeatures = function (featuresList, quantity) {
      if (typeof quantity === 'number' && quantity < featuresList.length) {
        return featuresList.slice(0, quantity);
      }
      return '';
    };
    var generatePhotos = function (photosList) {
      return photosList.sort(function () {
        return 0.5 - Math.random();
      });
    };
    var randomCeil = function (x) {
      return Math.ceil(Math.random() * x);
    };
    var randomFloor = function (x) {
      return Math.floor(Math.random() * x);
    };

    for (var i = 0; i < 8; i++) {
      var coordinateX = Math.round(Math.random() * mapWidth);
      var coordinateY = Math.round(130 + Math.random() * 500);
      ads[i] = {
        id: i,
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: TITLES[i],
          address: coordinateX + ', ' + coordinateY,
          price: Math.round(1000 + (Math.random() * 1000000)),
          type: TYPES[randomFloor(4)],
          rooms: randomCeil(5),
          guests: randomCeil(100),
          checkin: TIME[randomFloor(3)],
          checkout: TIME[randomFloor(3)],
          features: generateFeatures(FEATURES, randomCeil(FEATURES.length)),
          description: '',
          photos: generatePhotos(PHOTOS)
        },
        location: {
          x: coordinateX,
          y: coordinateY
        }
      };
    }

    return ads;
  })();

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
  var generateAdCard = function (data) {
    var card = cardTemplate.cloneNode(true);
    var TYPE = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };
    var photosBlock = card.querySelector('.popup__photos');
    var photoTemplate = photosBlock.querySelector('.popup__photo');

    card.dataset.id = data.id;
    card.classList.add('hidden');
    card.querySelector('.popup__title').textContent = data.offer.title;
    card.querySelector('.popup__text--address').textContent = data.offer.address;
    card.querySelector('.popup__text--price').innerHTML = data.offer.price + '&#x20bd;<span>/ночь</span>';
    card.querySelector('.popup__type').textContent = TYPE[data.offer.type];
    card.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ' выезд до ' + data.offer.checkout;
    for (var i = card.querySelector('.popup__features').children.length - 1; i >= data.offer.features.length; i--) {
      card.querySelector('.popup__features').removeChild(card.querySelector('.popup__features').children[i]);
    }
    card.querySelector('.popup__description').textContent = data.offer.description;
    for (i = 0; i < data.offer.photos.length; i++) {
      var photo = photoTemplate.cloneNode(true);
      photo.src = data.offer.photos[i];
      photosBlock.appendChild(photo);
    }
    photosBlock.removeChild(photosBlock.children[0]);
    card.querySelector('.popup__avatar').src = data.author.avatar;

    return card;
  };
  var generateAdCards = function (data) {
    var cards = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var card = generateAdCard(data[i]);
      cards.appendChild(card);
    }

    return cards;
  };
  var toggleFieldsetsEnabled = function (arr, status) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = !status;
    }
  };
  var setAddress = function (x, y) {
    adFormBlock.querySelector('#address').value = Math.round(x) + ', ' + Math.round(y);
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
      var cards = mapBlock.querySelectorAll('.map__card');
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.add('hidden');
      }
      mapBlock.querySelector('.map__card[data-id="' + id + '"]').classList.remove('hidden');
    }
  };
  var closePopup = function (id) {
    if (id !== undefined) {
      mapBlock.querySelector('.map__card[data-id="' + id + '"]').classList.add('hidden');
    }
  };

  var pins = generatePins(adsData);
  var cards = generateAdCards(adsData);
  mapPinsBlock.appendChild(pins);
  mapBlock.insertBefore(cards, document.querySelector('.map__filters-container'));

  pins = mapPinsBlock.querySelectorAll('.map__pin.hidden');
  cards = mapBlock.querySelectorAll('.map__card');
  addListeners(pins, cards);

  toggleFieldsetsEnabled(adFormFieldsets, false);

  mapPinMain.addEventListener('mousedown', function (evt) {
    var dragAndDrop = function () {
      evt.preventDefault();

      var maxX = mapBlock.offsetWidth - mapPinMain.offsetWidth;

      var pinPointShift = {
        'x': mapPinMain.offsetWidth / 2,
        'y': mapPinMain.offsetHeight + 16
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
          'y': mapPinMain.offsetTop - shift.y,
          'x': mapPinMain.offsetLeft - shift.x
        };

        if (newCoords.x < 0 || newCoords.x > maxX) {
          newCoords.x = newCoords.x < 0 ? 0 : newCoords.x;
          newCoords.x = newCoords.x > maxX ? maxX : newCoords.x;
        }
        if (newCoords.y < 130 || newCoords.y > 630) {
          newCoords.y = newCoords.y < 130 ? 130 : newCoords.y;
          newCoords.y = newCoords.y > 630 ? 630 : newCoords.y;
        }

        mapPinMain.style.top = newCoords.y + 'px';
        mapPinMain.style.left = newCoords.x + 'px';

        setAddress(newCoords.x + pinPointShift.x, newCoords.y + pinPointShift.y);

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        setAddress(mapPinMain.offsetLeft + pinPointShift.x, mapPinMain.offsetTop + pinPointShift.y);

        mapBlock.removeEventListener('mousemove', onMouseMove);
        mapBlock.removeEventListener('mouseup', onMouseUp);
      };

      mapBlock.addEventListener('mousemove', onMouseMove);
      mapBlock.addEventListener('mouseup', onMouseUp);
    };

    dragAndDrop();
    if (!mapIsActive) {
      mapBlock.classList.remove('map--faded');
      adFormBlock.classList.remove('ad-form--disabled');
      toggleFieldsetsEnabled(adFormFieldsets, true);
      for (var i = 0; i < pins.length; i++) {
        pins[i].classList.remove('hidden');
      }
      mapIsActive = true;
    }
  });

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
      mapBlock.classList.add('map--faded');
      for (var i = 0; i < pins.length; i++) {
        pins[i].classList.add('hidden');
        cards[i].classList.add('hidden');
      }
    };
    var mapPinMainReset = function () {
      mapPinMain.style.top = DEFAULT_ATTRS.mapPinMain.y + 'px';
      mapPinMain.style.left = DEFAULT_ATTRS.mapPinMain.x + 'px';
    };
    var formReset = function () {
      adFormBlock.classList.add('ad-form--disabled');
      inputPrice.min = DEFAULT_ATTRS.price.min;
      inputPrice.placeholder = DEFAULT_ATTRS.price.placeholder;
      onRoomNumberChange(DEFAULT_ATTRS.room_number);
    };
    var onResetClick = function () {
      mapReset();
      mapPinMainReset();
      formReset();
      mapIsActive = false;
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
})();
