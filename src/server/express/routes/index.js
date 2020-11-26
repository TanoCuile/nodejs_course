const express = require('express');
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
// We initialize multer instance
// As far as on this file we will use only one configuration for multer
// so we not importing multer package separatelly
const multer = require('multer')({
  dest: join(process.cwd(), 'data', 'uploads'),
});
exports.multer = multer;

const {initializeWetherRoutes} = require('@routes/wether');
const {initializeRegisterEndpoints} = require('./initializeRegisterEndpoints');
const {initializeLoginEndpoints} = require('./initializeLoginEndpoints');
const {initializeUploadEndpoint} = require('./initializeUploadEndpoint');
const {initializeHomePageEndpoint} = require('./initializeHomePageEndpoint');

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

  initializeHomePageEndpoint(app);

  initializeRegisterEndpoints(app);
  initializeLoginEndpoints(app);

  const apiRouter = new express.Router();
  initializeAPI(apiRouter);
  app.use('/api', apiRouter);

  // The endpoint which can process `multipart/form-data` and works with files
  // should have multer middleware
  // Here we letting multer know which field_name to use (is our case it's `custom_image`)
  initializeUploadEndpoint(app);

  debug('Routers initialized');
}

module.exports = {settUpRoutes};
