'use strict';

var generateData = function () {
  var ads = [];
  var mapWidth = document.querySelector('.map').offsetWidth;
  var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var checkins = ['12:00', '13:00', '14:00'];
  var checkouts = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var generateFeatures = function (featuresList, quantity) {
    var currentFeatures = [];
    for (var i = 0; i < quantity; i++) {
      currentFeatures[i] = featuresList[i];
    }
    return currentFeatures;
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
};
var adsData = generateData();
var mapPinsBlock = document.querySelector('.map__pins');
var mapPins = document.createDocumentFragment();
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var generatePin = function (pinX, pinY, pinAvatar, pinTitle) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = pinX + 'px';
  pin.style.top = pinY + 'px';
  pin.classList.add('map__pin');
  pin.innerHTML = '<img src="' + pinAvatar + '" width="40" height="40" draggable="false" alt="' + pinTitle + '">';
  return pin;
};
for (var i = 0; i < adsData.length; i++) {
  mapPins.appendChild(generatePin(adsData[i].location.x, adsData[i].location.y, adsData[i].author.avatar, adsData[i].offer.title));
}
mapPinsBlock.appendChild(mapPins);

var mapBlock = document.querySelector('.map');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var generateAdCard = function (data) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = data.offer.title;
  card.querySelector('.popup__text--address').textContent = data.offer.address;
  card.querySelector('.popup__text--price').innerHTML = data.offer.price + '&#x20bd;<span>/ночь</span>';
  var type;
  switch (data.offer.type) {
    case 'flat': type = 'Квартира'; break;
    case 'bungalo': type = 'Бунгало'; break;
    case 'house': type = 'Дом'; break;
    case 'palace': type = 'Дворец'; break;
  }
  card.querySelector('.popup__type').textContent = type;
  card.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ' выезд до ' + data.offer.checkout;
  for (i = card.querySelector('.popup__features').children.length - 1; i >= data.offer.features.length; i--) {
    card.querySelector('.popup__features').removeChild(card.querySelector('.popup__features').children[i]);
  }
  card.querySelector('.popup__description').textContent = data.offer.description;
  var photosBlock = card.querySelector('.popup__photos');
  var photoTemplate = photosBlock.querySelector('.popup__photo');
  for (i = 0; i < data.offer.photos.length; i++) {
    var photo = photoTemplate.cloneNode(true);
    photo.src = data.offer.photos[i];
    photosBlock.appendChild(photo);
  }
  photosBlock.removeChild(photosBlock.children[0]);
  card.querySelector('.popup__avatar').src = data.author.avatar;
  return card;
};
var adCard = generateAdCard(adsData[0]);
mapBlock.insertBefore(adCard, document.querySelector('.map__filters-container'));
