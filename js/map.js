'use strict';

var mapPinsBlock = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapBlock = document.querySelector('.map');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var adsData = (function() {
  var ads = [];
  var mapWidth = document.querySelector('.map').offsetWidth;
  var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var checkins = ['12:00', '13:00', '14:00'];
  var checkouts = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var generateFeatures = function (featuresList, quantity) {
    if (typeof quantity === "number" && quantity < featuresList.length) {
      return featuresList.slice(0, quantity);
    }
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
    pin.style.left = data[i].location.x + 'px';
    pin.style.top = data[i].location.y + 'px';
    pin.classList.add('map__pin');
    pin.innerHTML = '<img src="' + data[i].author.avatar + '" width="40" height="40" draggable="false" alt="' + data[i].offer.title + '">';
    mapPins.appendChild(pin);
  }
  return mapPins;
};
var generateAdCard = function (data) {
  var card = cardTemplate.cloneNode(true);
  var type = {
    'flat':'Квартира',
    'bungalo':'Бунгало',
    'house':'Дом',
    'palace':'Дворец'
  };
  var photosBlock = card.querySelector('.popup__photos');
  var photoTemplate = photosBlock.querySelector('.popup__photo');
  card.querySelector('.popup__title').textContent = data.offer.title;
  card.querySelector('.popup__text--address').textContent = data.offer.address;
  card.querySelector('.popup__text--price').innerHTML = data.offer.price + '&#x20bd;<span>/ночь</span>';
  card.querySelector('.popup__type').textContent = type[data.offer.type];
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
mapPinsBlock.appendChild(generatePins(adsData));
mapBlock.insertBefore(generateAdCard(adsData[0]), document.querySelector('.map__filters-container'));
