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

  app.use('/api', (req, res, next) => {
    // Smart Client responsible for authorization headers
    // req.headers.authorized === 1

    // General principle
    // Header: Cookie = 'cookie_name=COOKIE_VALUE;cookie_name_2=COOKIE_VALUE_2'
    const cookies = req.headers.cookie
      .split(';')
      // Step 1: [cookie_name=COOKIE_VALUE, cookie_name_2=COOKIE_VALUE_2]
      .map((cookie) => cookie.replace(/\ /g, '').split('='))
      // Step 2: [[cookie_name,COOKIE_VALUE], [cookie_name_2,COOKIE_VALUE_2]]
      .reduce((total, [key, value]) => {
        total[key] = value;
        return total;
      }, {});
      // Step 3: {cookie_name:COOKIE_VALUE, cookie_name_2:COOKIE_VALUE_2}

    if (cookies.authorized !== '1') {
      return res.status(403).json({status: 'Error'});
    }

    return next();
  });
}

module.exports = {
  setUpMiddlewares,
};
