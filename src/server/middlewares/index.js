const jsonBodyParser = require('json-body-parser');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateUserRequestMiddleware(req, res, next) {
  if (['GET', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  for (const user of req.body.users) {
    if (typeof user.id !== 'number') {
      return next(new Error());
    }
  }

  return next();
}

/**
 * @param {import('express').Application} app
 */
function setUpMiddlewares(app) {
  app.use(jsonBodyParser);

  app.use('/users', validateUserRequestMiddleware);
}

module.exports = {
  setUpMiddlewares,
};
