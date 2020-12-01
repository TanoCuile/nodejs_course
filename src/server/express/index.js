const express = require('express');
const {join} = require('path');
const cors = require('cors');
const ejs = require('ejs');
const {promisify} = require('util');

const {setUpMiddlewares} = require('@middlewares');
const {settUpRoutes} = require('@routes');
const {initializeDataBase} = require('../../models');
const {download} = require('../../services/file_storage');
// const { initializeDataBase } = require('../../entities');

function addJSStatic(app) {
  const pathToJS = join(process.cwd(), 'public', 'js');
  // Наступним ми оголошуємо:
  // за шляхом з префіксом: '/js' - дивись в папку: pathToJS
  app.use('/js', express.static(pathToJS));
}

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
  app.use(
    '/favicon.ico',
    express.static(join(process.cwd(), 'public', '/favicon.ico'))
  );
  // Додаємо синонім для доступу до css файлів
  app.use('/css', express.static(join(process.cwd(), 'public', 'css')));

  // Add `/img` alias for `/public/images` folder
  app.get('/img/:file_name', async (req, res) => {
    // Public images we want to load from cloud
    const fileName = req.params.file_name;

    // We are sending status code 200
    // Browser should know that response is ok
    res.status(200);
    // We need to let browser know that response is image
    res.setHeader('Content-Type', 'image/png');
    // After headers we need to send file content
    res.write(await download(fileName));
    // Then finishing response,
    // like letting browser know that it can stor listening port
    res.end();
  });

  // Додаємо синонім для доступу до js файлів (щоб виконувались в браузері)
  addJSStatic(app);

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
  // Створюємо об*єкт express.Application для конфігурації нашого сервера
  const app = express();

  return (
    initializeDataBase()
      .then(() => console.log('DB connected...'))
      .then(() => setUpExpressApplication(app))
      .then(() => console.log('App configured...'))
      // Запускаємо сконфігурований сервер
      .then(() => promisify(app.listen.bind(app))(port, host))
      .then(() => console.log('Listening...'))
      .catch((e) => console.error(e))
  );
}

module.exports = {
  runServer,
};
