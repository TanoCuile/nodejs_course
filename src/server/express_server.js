const express = require('express');
const {setUpMiddlewares} = require('./middlewares');
const {settUpRoutes} = require('./routes');

/**
 * @param {import('express').Application} app
 */
function setUpExpressApplication(app) {
  setUpMiddlewares(app);

  settUpRoutes(app);
}

// request -> system_functions -> express_router -> [m1, m2, m3 ..., mn] -> handler

// express().listen();

function runServer({host, port}) {
  return new Promise((resolve) => {
    const app = express();

    setUpExpressApplication(app);

    return app.listen(port, host, () => {
      console.log('Listening...');
      resolve();
    });
  });
}

module.exports = {
  runServer: runServer,
};
