const { getUsers } = require('@services/handle.users_info');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function handleUsersGet(req, res) {
  const carId = req.query.car_id;

  return res.json({
    status: 'Ok',
    data: await getUsers(carId),
  });
}

module.exports = { handleUsersGet };
