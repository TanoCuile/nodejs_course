const express = require('express');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateUserRequestMiddleware(req, res, next) {
  if (['GET', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  if (req.body && req.body.user.id && typeof req.body.user.id !== 'number') {
    return next(new Error());
  }

  return next();
}

/**
 * @param {import('express').Application} app
 */
function setUpMiddlewares(app) {
  app.use(express.json());

  app.use('/users', validateUserRequestMiddleware);
}

module.exports = {
  setUpMiddlewares,
};
