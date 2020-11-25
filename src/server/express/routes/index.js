const express = require('express');
const jwt = require('jsonwebtoken');
const {join} = require('path');
const {promises: fs} = require('fs');
const imagemin = require('imagemin');
const imageminPNG = require('imagemin-pngquant');
const imageminJPG = require('imagemin-jpegtran');
const debug = require('debug')('app:routers:logs');
const {
  getUsers,
  registerNewUser,
  loginUser,
} = require('@services/handle.users_info');
const {usersCRUD} = require('@routes/users');
const {SESSION_COOKIE_NAME, JWT_SECRET} = require('@/config');
// We initialize multer instance
// As far as on this file we will use only one configuration for multer
// so we not importing multer package separatelly
const multer = require('multer')({
  dest: join(process.cwd(), 'data', 'uploads'),
});

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

    const images = await fs.readdir(join(process.cwd(), 'public', 'images'));

    return res.render('index.html.ejs', {
      name: req.user ? req.user.getFullName() : 'John Doe',
      images,
      users,
    });
  });

  initializeRegisterEndpoints(app);
  initializeLoginEndpoints(app);

  const apiRouter = new express.Router();
  initializeAPI(apiRouter);
  app.use('/api', apiRouter);

  // The endpoint which can process `multipart/form-data` and works with files
  // should have multer middleware
  // Here we letting multer know which field_name to use (is our case it's `custom_image`)
  app.post('/upload', multer.single('custom_image'), async (req, res) => {
    /**
     * @type {string}
     */
    const file = req.file;

    // Validate type of uploaded file
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return res.status(400).json({status: 'Error', message: 'Not supported type'});
    }

    /**
     * @type {string}
     */
    const fileName = file.originalname;
    /**
     * @type {string}
     */
    const multerTemporaryFilePath = file.path;

    /**
     * @type {[{destinationPath: string}]}
     */
    const fileInfo = await imagemin([multerTemporaryFilePath], {
      destination: 'public/images',
      plugins: [imageminJPG(), imageminPNG()],
    });

    /**
     * @type {string}
     */
    const finalImagePath = fileInfo[0].destinationPath;

    // We removing temporary file
    // Usually better to do that asynchroniously
    await fs.unlink(multerTemporaryFilePath);
    // Also we need to move minified file into public folder
    // where it can be accesible from browser by `express.static`
    await fs.rename(
      join(process.cwd(), finalImagePath),
      join(process.cwd(), 'public', 'images', fileName)
    );

    // We wat to redirect to home page(because we not have separated page)
    return res.redirect('/');
  });

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
