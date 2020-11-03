const fs = require('fs');
const { PATH_TO_INDEX } = require('../../config');
const { handleUsersPost } = require('./handleUserPost');
const { handleUsersGet } = require('./handleUsersGet');

/**
 * @param {import('express').Application} app
 */
function settUpRoutes(app) {
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    // Simulation of `pipe`
    return fs.createReadStream(PATH_TO_INDEX)
      .on('data', res.send.bind(res))
      // .on('end', res.end); Don't do this, invalid context
      .on('end', res.end.bind(res));
  });

  app.post('/users', (req, res) => handleUsersPost(req, res));

  app.get('/users', (req, res) => handleUsersGet(res));
}

module.exports = { settUpRoutes };

/**
 * @typedef {{users: {
 *      name: string;
 *      id: number;}[];
 * }} UsersRequestPayload
 */
