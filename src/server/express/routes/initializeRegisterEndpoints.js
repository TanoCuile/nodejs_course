const express = require('express');
const { registerNewUser } = require('@services/handle.users_info');

function initializeRegisterEndpoints(app) {
  // Endpoint for rendering register page
  app.get('/register', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    return res.render('register.html.ejs', { error: undefined });
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

      await registerNewUser({ userInfo: userInformation });
      return res.redirect('/');
    } catch (e) {
      return res.render('register.html.ejs', {
        error: e.toString(),
      });
    }
  });
}
exports.initializeRegisterEndpoints = initializeRegisterEndpoints;
