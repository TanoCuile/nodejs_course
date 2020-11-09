const express = require('express');
const {join} = require('path');
const cors = require('cors');
const ejs = require('ejs');
const {setUpMiddlewares} = require('@middlewares');
const {settUpRoutes} = require('@routes');

/**
 * Конфігуруємо сервер
 *
 * @param {import('express').Application} app
 */
function setUpExpressApplication(app) {
  app.use(cors());
  app.set('views', join(process.cwd(), 'src', 'views'));
  app.engine('ejs', ejs.renderFile);
  // Додаємо іконку нашого сайту, щоб браузер краще його показував
  app.use('/favicon.ico', express.static(join(process.cwd(), 'public', '/favicon.ico')));
  // Додаємо синонім для доступу до css файлів
  app.use('/css', express.static(join(process.cwd(), 'public', 'css')));
  // Додаємо синонім для доступу до js файлів (щоб виконувались в браузері)
  app.use('/js', express.static(join(process.cwd(), 'public', 'js')));

  // Ініціалізуємо основні middlewares (проміжний обробники запитів)
  setUpMiddlewares(app);

  // Ініціалузуємо endpoints (кінцеві обробники запитів)
  settUpRoutes(app);
}

// Дуже загальна структура обробки запиту
// request -> system_functions -> express_router -> [m1, m2, m3 ..., mn] -> handler
// system_functions - функції express, для того щоб підготувати req (express.Request) об'єкту
// express_router - опрацювання шляху запиту, для того, щоб запустити необхідні middleware а endpoints
// [m1, m2, m3 ..., mn] - набір проміжних обробників, які підпадають під express_router
// handler - кінцевий обробник який підпадає під express_router

// Функція для запуску сервера (вхідна точка запуску express сервера)
function runServer({host, port}) {
  return new Promise((resolve) => {
    // Створюємо об*єкт express.Application для конфігурації нашого сервера
    const app = express();

    setUpExpressApplication(app);

    // Запускаємо сконфігурований сервер
    return app.listen(port, host, () => {
      console.log('Listening...');
      resolve();
    });
  });
}

module.exports = {
  runServer,
};
