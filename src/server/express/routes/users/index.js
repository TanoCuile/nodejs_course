const {handleUsersPost} = require('./handleUserPost');
const {handleUsersGet} = require('./handleUsersGet');
const {handleSingleUserGet} = require('./handleSingleUserGet');
const {handleUserPut} = require('./handleUserPut');

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
  app.get('/:id', (req, res) => handleSingleUserGet(req, res));

  // Update
  app.put('/:id', (req, res) => handleUserPut(req, res));

  // Delete
  app.delete('/:id', (req, res) => {
    res.json({status: 'OK'});
  });
}
exports.usersCRUD = usersCRUD;
