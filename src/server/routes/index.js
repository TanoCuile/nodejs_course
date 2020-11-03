const fs = require('fs');
const cors = require('cors');
const { PATH_TO_INDEX } = require('../../config');
const { handleUsersPost } = require('./handleUserPost');
const { handleUsersGet } = require('./handleUsersGet');
const { getUserById, updateUserById } = require('../handle.users_info');

// http://192.188.211.34/ -> Even your address
// http://blah.foo.com -> 192.188.211.34  -> DNS
// World domain refresh delay 1-2days

/**
 * @param {import('express').Application} app
 */
function usersCRUD(app) {
  // Create
  app.post('/users', (req, res) => handleUsersPost(req, res));

  // Read list
  app.get('/users', (req, res) => handleUsersGet(res));

  // Read one item
  app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    res.json({ status: 'OK', data: await getUserById(Number(userId)) });
  });

  // Update
  app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const userInfo = req.body.user;

    await updateUserById(Number(userId), userInfo);

    return res.json({ status: 'OK' });
  });

  // Delete
  app.delete('/users/:id', (req, res) => {
    res.json({ status: 'OK' });
  });
}
/**
 * @param {import('express').Application} app
 */
function settUpRoutes(app) {
  // For Sending correct 'Access-Control-Allow-Origin' for cors
  // app.use('*', (req, res, next) => {
  //   res.setHeader('Origin', '*');
  //   if (req.method === 'OPTIONS') {
  //     return res.end();
  //   }
  //   return next();
  // });
  // Add `Access-Control-Allow-Origin` by using `cors`
  app.use(cors());
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    // Simulation of `pipe`
    return (
      fs
        .createReadStream(PATH_TO_INDEX)
        .on('data', res.send.bind(res))
        // .on('end', res.end); Don't do this, invalid context
        .on('end', res.end.bind(res))
    );
  });

  usersCRUD(app);
}

module.exports = { settUpRoutes };

/**
 * @typedef {{users: {
 *      name: string;
 *      id: number;}[];
 * }} UsersRequestPayload
 */
