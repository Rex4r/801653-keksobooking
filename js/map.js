'use strict';

var mapIsActive = false;
var mapBlock = document.querySelector('.map');
var mapPinsBlock = document.querySelector('.map__pins');
var mapPinMain = mapPinsBlock.querySelector('.map__pin--main');
var adFormBlock = document.querySelector('.ad-form');
var adFormFieldsets = adFormBlock.querySelectorAll('fieldset');
var renderAds = function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var adsData = (function () {
    var ads = [];
    var mapWidth = document.querySelector('.map').offsetWidth;
    var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
    var types = ['palace', 'flat', 'house', 'bungalo'];
    var checkins = ['12:00', '13:00', '14:00'];
    var checkouts = ['12:00', '13:00', '14:00'];
    var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
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
    for (var i = 0; i < 8; i++) {
      var coordinateX = Math.round(Math.random() * mapWidth);
      var coordinateY = Math.round(130 + Math.random() * 500);
      ads[i] = {
        id: i,
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png',
        },
        offer: {
          title: titles[i],
          address: coordinateX + ', ' + coordinateY,
          price: Math.round(1000 + (Math.random() * 1000000)),
          type: types[Math.floor(Math.random() * 4)],
          rooms: Math.ceil(Math.random() * 5),
          guests: Math.ceil(Math.random() * 100),
          checkin: checkins[Math.floor(Math.random() * 3)],
          checkout: checkouts[Math.floor(Math.random() * 3)],
          features: generateFeatures(features, Math.ceil(Math.random() * features.length)),
          description: '',
          photos: generatePhotos(photos)
        },
        location: {
          x: coordinateX,
          y: coordinateY
        }
      };
    }
    return ads;
  })();
  var generatePins = function (data) {
    var mapPins = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var pin = pinTemplate.cloneNode(true);
      pin.dataset.id = data[i].id;
      pin.style.left = data[i].location.x + 'px';
      pin.style.top = data[i].location.y + 'px';
      pin.classList.add('map__pin');
      pin.innerHTML = '<img src="' + data[i].author.avatar + '" width="40" height="40" draggable="false" alt="' + data[i].offer.title + '">';
      mapPins.appendChild(pin);
    }
    return mapPins;
  };
  var generateAdCards = function (data) {
    var cards = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var card = cardTemplate.cloneNode(true);
      var type = {
        'flat': 'Квартира',
        'bungalo': 'Бунгало',
        'house': 'Дом',
        'palace': 'Дворец'
      };
      var photosBlock = card.querySelector('.popup__photos');
      var photoTemplate = photosBlock.querySelector('.popup__photo');
      card.dataset.id = data[i].id;
      card.classList.add('hidden');
      card.querySelector('.popup__title').textContent = data[i].offer.title;
      card.querySelector('.popup__text--address').textContent = data[i].offer.address;
      card.querySelector('.popup__text--price').innerHTML = data[i].offer.price + '&#x20bd;<span>/ночь</span>';
      card.querySelector('.popup__type').textContent = type[data[i].offer.type];
      card.querySelector('.popup__text--capacity').textContent = data[i].offer.rooms + ' комнаты для ' + data[i].offer.guests + ' гостей';
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + data[i].offer.checkin + ' выезд до ' + data[i].offer.checkout;
      for (var j = card.querySelector('.popup__features').children.length - 1; j >= data[i].offer.features.length; j--) {
        card.querySelector('.popup__features').removeChild(card.querySelector('.popup__features').children[j]);
      }
      card.querySelector('.popup__description').textContent = data[i].offer.description;
      for (j = 0; j < data[i].offer.photos.length; j++) {
        var photo = photoTemplate.cloneNode(true);
        photo.src = data[i].offer.photos[j];
        photosBlock.appendChild(photo);
      }
      photosBlock.removeChild(photosBlock.children[0]);
      card.querySelector('.popup__avatar').src = data[i].author.avatar;
      cards.appendChild(card);
    }
    return cards;
  };
  mapPinsBlock.appendChild(generatePins(adsData));
  mapBlock.insertBefore(generateAdCards(adsData), document.querySelector('.map__filters-container'));
};
var toggleFieldsetsEnabled = function (arr, status) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = !status;
  }
};
var setAddress = function (x, y) {
  adFormBlock.querySelector('#address').value = x + ', ' + y;
};
toggleFieldsetsEnabled(adFormFieldsets, false);
mapPinMain.addEventListener('mouseup', function () {
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
  var addListeners = function () {
    var pins = mapBlock.querySelectorAll('.map__pin');
    var cards = mapBlock.querySelectorAll('.map__card');
    for (var i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', function (evt) {
        openPopup(evt.currentTarget.dataset.id);
      });
    }
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function (evt) {
        if (evt.target.classList.contains('popup__close')) {
          closePopup(evt.currentTarget.dataset.id);
        }
      });
    }
  };
  var coordX = Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2);
  var coordY = Math.round(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2);
  mapBlock.classList.remove('map--faded');
  adFormBlock.classList.remove('ad-form--disabled');
  toggleFieldsetsEnabled(adFormFieldsets, true);
  setAddress(coordX, coordY);
  if (!mapIsActive) {
    renderAds();
    addListeners();
    mapIsActive = true;
  }
});


