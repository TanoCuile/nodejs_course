const express = require('express');
const debug = require('debug')('app:routers:logs');
const { getUsers } = require('../handle.users_info');
const { usersCRUD } = require('./users/usersCRUD');

const { loadCurrentWetherForPosition } = require('../wether.loader');
const { initializeWetherRoutes } = require('./initializeWetherRoutes');

function initializeAPI(app) {
  /**
   * @type {import('express').Router}
   */
  const usersRouter = new express.Router();
  usersCRUD(usersRouter);
  app.use('/users', usersRouter);

  /**
   * @type {import('express').Router}
   */
  const wetherRoute = new express.Router();
  initializeWetherRoutes(wetherRoute);
  app.use('/wether', wetherRoute);
}

/**
 * @param {import('express').Application} app
 */
function settUpRoutes(app) {
  // Add `Access-Control-Allow-Origin` by using `cors`

  app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const { users } = await getUsers();
    return res.render('index.html.ejs', {
      name: req.query.name || 'John',
      users,
    });
  });

  const apiRouter = new express.Router();
  initializeAPI(apiRouter);
  app.use('/api', apiRouter);

  debug('Routers initialized');
}

module.exports = { settUpRoutes };
