const express = require('express');
const jwt = require('jsonwebtoken');
const { SESSION_COOKIE_NAME, JWT_SECRET } = require('@/config');
const { Session } = require('../../../entities/session');
const { loginUser } = require("./index");

function initializeLoginEndpoints(app) {
  app.get('/log_in', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    return res.render('login.html.ejs', { error: undefined });
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

      const user = await loginUser({ userInfo: userInformation });

      await setUpLoggedInSession({ res, user });

      return res.redirect('/');
    } catch (e) {
      return res.render('login.html.ejs', {
        error: e.toString(),
      });
    }
  });
}
exports.initializeLoginEndpoints = initializeLoginEndpoints;
// Doing whatever we need to setup liggedIn session

async function setUpLoggedInSession({ res, user }) {
  const session = await Session.create({
    userId: user.id,
  });
  session.putData({ loggedIn: new Date().toString() });
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
