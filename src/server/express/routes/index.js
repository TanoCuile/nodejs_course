const express = require('express');
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:routers:logs');
const {
  getUsers,
  registerNewUser,
  loginUser,
} = require('@services/handle.users_info');
const {usersCRUD} = require('@routes/users');
const {SESSION_COOKIE_NAME, JWT_SECRET} = require('@/config');

const {initializeWetherRoutes} = require('@routes/wether');
const {Session} = require('../../../entities/session');

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
    const {page, sort, sort_direction: sortDirection} = req.query || {};
    res.setHeader('Content-Type', 'text/html');
    const {users} = await getUsers({
      page: Number(page) || 1,
      sort: sort || 'age',
      sortDirection: Number(sortDirection) || 1,
    });
    console.log(users);
    return res.render('index.html.ejs', {
      name: req.user ? req.user.getFullName() : 'John Doe',
      users,
    });
  });

  initializeRegisterEndpoints(app);
  initializeLoginEndpoints(app);

  const apiRouter = new express.Router();
  initializeAPI(apiRouter);
  app.use('/api', apiRouter);

  debug('Routers initialized');
}

module.exports = {settUpRoutes};

function initializeLoginEndpoints(app) {
  app.get('/log_in', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    return res.render('login.html.ejs', {error: undefined});
  });

  // Endpoint for handling registration info
  app.post('/log_in', express.urlencoded(), async (req, res) => {
    try {
      /**
       * @type {{
       *    email: string,
       *    password: string,
       * }}
       */
      const userInformation = req.body;

      const user = await loginUser({userInfo: userInformation});

      await setUpLoggedInSession({res, user});

      return res.redirect('/');
    } catch (e) {
      return res.render('login.html.ejs', {
        error: e.toString(),
      });
    }
  });
}

// Doing whatever we need to setup liggedIn session
async function setUpLoggedInSession({res, user}) {
  const session = await Session.create({
    userId: user.id,
  });
  session.putData({loggedIn: new Date().toString()});
  session.save();
  // Possible way to have more session data - store it on cookies, but there's limitation 4Kb
  // res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}={"sess_id": ${session.id}, "name": ${user.getFullName()}}`);
  const token = jwt.sign(
    {
      full_name: user.getFullName(),
      session_id: session.id,
    },
    JWT_SECRET
  );
  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=${token}`);
  // new Buffer(JSON.stringify({sess_id: 1, full_name: 'Stri Tred'})).toString('base64')
  // eyJzZXNzX2lkIjoxLCJmdWxsX25hbWUiOiJTdHJpIFRyZWQifQ==
}

function initializeRegisterEndpoints(app) {
  // Endpoint for rendering register page
  app.get('/register', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    return res.render('register.html.ejs', {error: undefined});
  });

  // Endpoint for handling registration info
  app.post('/register', express.urlencoded(), async (req, res) => {
    try {
      /**
       * @type {{
       *    first_name: string,
       *    last_name: string,
       *    email: string,
       *    password: string,
       * }}
       */
      const userInformation = req.body;

      await registerNewUser({userInfo: userInformation});
      return res.redirect('/');
    } catch (e) {
      return res.render('register.html.ejs', {
        error: e.toString(),
      });
    }
  });
}
