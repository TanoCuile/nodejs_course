const { handleUsersPost } = require('./handleUserPost');
const { handleUsersGet } = require('./handleUsersGet');
const { getUserById, updateUserById } = require('../../handle.users_info');

// http://192.188.211.34/ -> Even your address
// http://blah.foo.com -> 192.188.211.34  -> DNS
// World domain refresh delay 1-2days
/**
 * @param {import('express').Application} app
 */
function usersCRUD(app) {
  // Create
  app.post('/', (req, res) => handleUsersPost(req, res));

  // Read list
  app.get('/', (req, res) => handleUsersGet(res));

  // Read one item
  app.get('/:id', async (req, res) => {
    const userId = req.params.id;
    res.json({ status: 'OK', data: await getUserById(Number(userId)) });
  });

  // Update
  app.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const userInfo = req.body.user;

    await updateUserById(Number(userId), userInfo);

    return res.json({ status: 'OK' });
  });

  // Delete
  app.delete('/:id', (req, res) => {
    res.json({ status: 'OK' });
  });
}
exports.usersCRUD = usersCRUD;
