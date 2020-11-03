const { handleUserInfo } = require('../handle.users_info');
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

module.exports = { handleUsersPost };
