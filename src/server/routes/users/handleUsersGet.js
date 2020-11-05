const { getUsers } = require('../../handle.users_info');

/**
 * @param {import('express').Response} res
 */
async function handleUsersGet(res) {
  return res.json({
    status: 'Ok',
    data: await getUsers(),
  });
}

module.exports = { handleUsersGet };
