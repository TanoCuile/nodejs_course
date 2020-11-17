const { handleUserInfo } = require('@services/handle.users_info');
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function handleUsersPost(req, res) {
  try {
    /**
     * @type {UsersRequestPayload}
     */
    const newUserInfo = req.body;

    await handleUserInfo(newUserInfo);

    return res.json({
      status: 'Ok',
      data: newUserInfo.user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 'Error', message: e.toString(), data: e });
  }
}

module.exports = { handleUsersPost };
