const { getUserById } = require('@services/handle.users_info');

async function handleSingleUserGet(req, res) {
  const userId = req.params.id;
  res.json({ status: 'OK', data: await getUserById((userId)) });
}
exports.handleSingleUserGet = handleSingleUserGet;
