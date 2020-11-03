// Підключаємо пакет `http` системний пакет NodeJs для роботи змережею
const http = require('http');
const { handleUserInfo } = require('./handle.users_info');

/**
 * Оголошуємо функцію для відправки відповіді
 *
 * @param {import('http').ServerResponse} res
 */
function sendResponse(res) {
  // Відправляємо заголовок `Content-Type`
  // щоб повідомити клієнту, в якому форматі буде відповідь
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  // Переводимо наш об'єкт в стрічку JSON формату
  const body = JSON.stringify({ status: 'OK' });

  // Відправляємо відповідь клієнту
  res.write(body, () => {
    // Закінчуємо відправку відповіді
    // щоб клієнт міг повністю прочитати відповідь
    res.end();
  });
}

/**
 * Оголошуємо функцію для обробки і слухання запитів
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
function requestListener(req, res) {
  let usersString = '';
  // Перевіряємо метод запиту
  // якщо це ['POST', 'PUT', 'PATCH'] то запит містить `body`
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    // оскільки `body` може містити найбільше інформації
    // нам потрібно його прочитати, інакше систему побудувати важко
    // для цього нам потрібно опрацювати подію `data`.
    // УВАГА! Часто може приходити кілька таких подій `data`
    // оскільки у вибадку великого запиту, дані можуть бути розділені на кілька частин
    req.on('data', (data) => {
      // Аргумент "data" приходить як Buffer тому його перш за все перевести в String
      usersString += data.toString();
    });

    // На випадок помилки запиту - нам потрібно підписатись на подію `error`
    // і зробити необхідні дії
    req.on('error', () => {
      // Відправляємо стату помилки
      res.writeHead(500);
      // Закінчуємо відправку відповіді
      // щоб клієнт міг повністю прочитати відповідь
      res.end();
    });

    // Після закінчення обробки запиту приходить подія `end`
    // і нам потрібно додати обробник
    req.on('end', () => {
      console.log('Request finished');
      // Якщо є "usersString" - нам потрібно його опрацювати
      if (usersString) {
        /**
         * @type {import('./handle.users_info').HandleUsersPayload}
         */
        const users = JSON.parse(usersString);
        // Відправляємо дані запиту на подальше опрацювання
        // УВАГА! Варто будувати програму так,
        // щоб ви не думали як і навіщо ви робите подальше опрацювання
        // при розробці маршрутизації
        handleUserInfo(users);
      }

      // Зазвичай відповідь формуємо після обробки запиту
      // Проте для прикладу ми робомо це асинхронно
      // sendResponse(res);
    });
  }

  // Для прикладу асинйронності ми відправляємо відповід до того, як опрацювався запит
  // Це може бути корисно для запитів логування, де клієнту потрібно відповідь якомога швидше
  // а можливі помилки не цікавлять
  sendResponse(res);
}

/**
 * @param {{host: string, port: number}} payload
 */
function runServer({ host, port }) {
  // Створюємо сервер
  // який буде сгухати порт і хост а також для запитьів буде використовувати нашу функцію
  http.createServer(requestListener).listen(port, host);
  // Відправляємо пустий Promise для подальшої ініціалізації
  return Promise.resolve();
}

module.exports = {
  runServer,
};
