'use strict';

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

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

  window.cards = generateAdCards(window.data);
})();
