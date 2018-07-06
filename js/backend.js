'use strict';

(function () {
  var createXHR = function (xhr, URL, method, onSuccess, onError) {
    xhr.open(method, URL);
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  var getData = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    var URL = 'https://js.dump.academy/keksobooking/data';
    var METHOD = 'GET';

    createXHR(xhr, URL, METHOD, onSuccess, onError);

    xhr.send();
  };

  var sendData = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    var URL = 'https://js.dump.academy/keksobooking';
    var METHOD = 'POST';

    createXHR(xhr, URL, METHOD, onSuccess, onError);

    xhr.send(data);
  };

  window.document.backend = {
    'getData': getData,
    'sendData': sendData
  };
})();
