const {User} = require('../entities/user');
const {Car} = require('../entities/car');

/**
 * @param {number} carId
 *
 * @returns {Promise<{users: User[]}>}
 */
async function getUsers(carId) {
  let where = {};
  if (carId) {
    where = {'id': carId};
  }
  return {
    users: await User.findAll({
      include: [
        {
          model: Car,
          as: 'cars',
          where
        },
      ],
    }),
  };
}

/**
 * @param {number} id
 *
 * @returns {Promise<User>}
 */
async function getUserById(id) {
  return User.findOne({where: {id}});
}

async function updateUserById(id, userInfo) {
  if (userInfo.id) {
    throw new Error('You cannot change user.id');
  }

  await User.update(userInfo, {where: {id}});
}

/**
 * @param {HandleUsersPayload} payload
 */
async function handleUserInfo({user}) {
  // we can add custom validation. or use model one
  // validateUserCreation();
  // By using `User` interface we are adding new document to `user` collection
  return User.create({
    firstName: user.firstName,
    lastName: user.lastName,
  });
}

/**
 * @param {string} id
 */
async function deleteUserFromDB(id) {
  // Easiest way to delete by ID
  return User.destroy({where: {id}});
  // If you need to delete by condition use: next
  // return User.deleteOne({ _id: id });
}

module.exports = {
  handleUserInfo,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserFromDB,
};

/**
 * @typedef {{
 *      name: string,
 *      id: number
 *    }} User
 */

/**
 * @typedef {{"user": User}} HandleUsersPayload
 */
