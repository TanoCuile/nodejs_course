const express = require('express');
const jwt = require('jsonwebtoken');
const {SESSION_COOKIE_NAME, JWT_SECRET} = require('@/config');
const {Session} = require('../../../entities/session');
const {User} = require('../../../entities/user');

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

  app.use((req, res, next) => {
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

    req.cookies = cookies;

    next();
  });

  app.use(async (req, res, next) => {
    try {
      const token = req.cookies[SESSION_COOKIE_NAME];
      if (!token) {
        return res.json({status: 'Error'});
      }
      const parsed = jwt.verify(token, JWT_SECRET);
      req.user = parsed;
    } catch (e) {
      return next();
    }
    return next();
    // const {infoObject, algoObject} = getJWTInfoHR(req);

    // if (infoObject && infoObject.session_id) {
    //   return res.json({infoObject, algoObject});
    // }

    // // Take session ID from cookie
    // const sessionId = req.cookies[SESSION_COOKIE_NAME];

    // if (!sessionId) {
    //   return next();
    // }

    // const session = await Session.findOne({
    //   include: [User],
    //   where: {id: sessionId},
    // });

    // if (session) {
    //   req.session = session;
    //   req.user = session.user;
    // } else {
    //   res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=`);
    // }

    // return next();
  });

  app.use('/api', (req, res, next) => {
    // Smart Client responsible for authorization headers
    // req.headers.authorized === 1

    if (!req.user) {
      return res.status(403).json({status: 'Error'});
    }

    return next();
  });
}

module.exports = {
  setUpMiddlewares,
};

/**
 * Hand writter JWT parser
 *
 * @param {import('express').Request} req
 */
function getJWTInfoHR(req) {
  const authorization = req.headers['authorization'];

  // Remove 'Bearer' prefix
  const [, jwt] = authorization.split(' ');

  // Split 'jwt' into functional parts
  const [algo, info, secured] = jwt.split('.');

  const algoObject = JSON.parse(Buffer.from(algo, 'base64').toString('utf8'));
  const infoObject = JSON.parse(Buffer.from(info, 'base64').toString('utf8'));
  return {infoObject, algoObject};
}
