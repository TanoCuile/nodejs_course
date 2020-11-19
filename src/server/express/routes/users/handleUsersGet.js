const {getUsers} = require('@services/handle.users_info');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function handleUsersGet(req, res) {
  const carId = req.query.car_id;

  // const existingCookies = res.getHeader('');
  // We are requiring browser setup new cookie
  // res.setHeader('Set-Cookie', 'authorized=1;');

  const response = res.json({
    status: 'Ok',
    currentUser: {
      full_name: req.user.getFullName(),
    },
    data: await getUsers(carId),
  });

  return response;
}

module.exports = {handleUsersGet};
