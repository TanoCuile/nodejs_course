const path = require('path');
const fs = require('fs/promises');

function handleUserInfo() {
  console.log('Handle...');
  return Promise.resolve();
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function handleUsersPost(req, res) {
  /**
   * @type {{users: {name: string, id: number}[]}}
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
    data: JSON.parse(
      (
        await fs.readFile(path.join(process.cwd(), 'data', 'data.json'))
      ).toString()
    ),
  });
}

/**
 * @param {import('express').Application} app
 */
function settUpRoutes(app) {
  app.post('/users', (req, res) => {
    return handleUsersPost(req, res);
  });

  app.get('/users', (req, res) => {
    return handleUsersGet(res);
  });
}

module.exports = {settUpRoutes};
