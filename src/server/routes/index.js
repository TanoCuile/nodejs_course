const { promises: fs } = require('fs');
const { handleUserInfo } = require('../handle.users_info');
const { PATH_TO_DATA_FILE } = require('../../config');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function handleUsersPost(req, res) {
  /**
   * @type {UsersRequestPayload}
   */
  const newUserInfo = req.body;

  handleUserInfo(newUserInfo);

  return res.json({
    status: 'Ok',
    data: [
      {
        name: 'Ben',
        id: 1,
      },
    ],
  });
}

/**
 * @param {import('express').Response} res
 */
async function handleUsersGet(res) {
  return res.json({
    status: 'Ok',
    data: JSON.parse((await fs.readFile(PATH_TO_DATA_FILE)).toString()),
  });
}

/**
 * @param {import('express').Application} app
 */
function settUpRoutes(app) {
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
