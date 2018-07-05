'use strict';

(function () {
  window.data = (function () {
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
})();
