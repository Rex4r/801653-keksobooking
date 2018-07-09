'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var generatePin = function (data, num) {
    var pin = pinTemplate.cloneNode(true);
    var pinImg = pin.querySelector('img');

    pin.classList.add('hidden');
    pin.dataset.id = num;
    pin.style.left = data.location.x + 'px';
    pin.style.top = data.location.y + 'px';
    pinImg.src = data.author.avatar;
    pinImg.alt = data.offer.title;

    return pin;
  };

  var generatePins = function (data, count) {
    var mapPins = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var pin = generatePin(data[i], i);
      mapPins.appendChild(pin);
    }
    if (window.map.mapIsActive === true) {
      var pins = mapPins.querySelectorAll('.map__pin');
      count = count < pins.length ? count : pins.length;
      for (i = 0; i < count; i++) {
        pins[i].classList.remove('hidden');
      }
    }

    return mapPins;
  };

  var filterPins = function (filterData, maxCount) {
    var data = window.map.adsData;
    data.forEach(function (item, i) {
      item.id = i;
    });
    var newData = data.filter(function (ad) {
      var checkPrice = function (filtePriceGrop, adPrice) {
        var Price = {
          'MIN_HIGH': 50000,
          'MIN_MIDDLE': 10000
        };
        var PriceGroup = {
          'high': adPrice >= Price.MIN_HIGH,
          'middle': adPrice >= Price.MIN_MIDDLE && adPrice < Price.MIN_HIGH,
          'low': adPrice < Price.MIN_MIDDLE
        };
        return PriceGroup[filtePriceGrop];
      };
      var checkFeatures = function (filterFeatures, adFeatures) {
        var correct = true;
        filterFeatures.forEach(function (feature) {
          if (correct) {
            correct = adFeatures.includes(feature);
          }
        });
        return correct;
      };
      var correct = {
        type: filterData.type === 'any' || filterData.type === ad.offer.type,
        price: filterData.price === 'any' || checkPrice(filterData.price, ad.offer.price),
        rooms: filterData.rooms === 'any' || +filterData.rooms === ad.offer.rooms,
        guests: filterData.guests === 'any' || +filterData.guests === ad.offer.guests,
        features: filterData.features === [] || checkFeatures(filterData.features, ad.offer.features)
      };
      return correct.type && correct.price && correct.rooms && correct.guests && correct.features;
    });
    var correctIds = newData.map(function (ad) {
      return ad.id;
    }).slice(0, maxCount);
    var updatePins = function (ids) {
      window.map.cards.forEach(function (card) {
        card.classList.add('hidden');
      });
      window.map.pins.forEach(function (pin) {
        if (ids.includes(+pin.dataset.id)) {
          pin.classList.remove('hidden');
        } else {
          pin.classList.add('hidden');
        }
      });
    };

    updatePins(correctIds);
  };

  window.pins = {
    'generatePins': generatePins,
    'filterPins': filterPins
  };
})();

