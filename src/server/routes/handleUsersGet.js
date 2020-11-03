const { promises: fs } = require('fs');
const { PATH_TO_DATA_FILE } = require('../../config');

/**
 * @param {import('express').Response} res
 */
async function handleUsersGet(res) {
  return res.json({
    status: 'Ok',
    data: JSON.parse((await fs.readFile(PATH_TO_DATA_FILE)).toString()),
  });
}

module.exports = { handleUsersGet };
