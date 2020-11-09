const { updateUserById } = require('@services/handle.users_info');


async function handleUserPut(req, res) {
  const userId = req.params.id;
  const userInfo = req.body.user;

  await updateUserById(Number(userId), userInfo);

  return res.json({ status: 'OK' });
}
exports.handleUserPut = handleUserPut;
