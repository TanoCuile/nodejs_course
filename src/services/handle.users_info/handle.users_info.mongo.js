const {UserModel} = require('../../models/user');

/**
 * @returns {Promise<{users: User[]}>}
 */
async function getUsers(
  {page, sort, sortDirection} = {page: 1, sort: 'age', sortDirection: 1}
) {
  console.log('Request', {page, sort, sortDirection});
  return {
    users: await UserModel.find(
      {},
      {},
      {
        sort: {
          [sort]: sortDirection,
        },
        skip: (page - 1) * 5,
        limit: 5,
      }
    ),
  };
}

/**
 * @param {number} id
 *
 * @returns {Promise<User>}
 */
async function getUserById(id) {
  return UserModel.findById(id);
}

async function updateUserById(id, userInfo) {
  if (userInfo.id) {
    throw new Error('You cannot change user.id');
  }

  // // Find document
  // const user = await UserModel.findById(id);
  // // Update loaded document
  // Object.assign(user, userInfo);
  // // Save changed doccument to DB
  // await user.save();

  await UserModel.findByIdAndUpdate(id, userInfo);
}

/**
 * @param {HandleUsersPayload} payload
 */
async function handleUserInfo({user}) {
  // we can add custom validation. or use model one
  // validateUserCreation();
  // By using `UserModel` interface we are adding new document to `user` collection
  return UserModel.create({
    name: user.name,
  });
}

/**
 * @param {string} id
 */
async function deleteUserFromDB(id) {
  // Easiest way to delete by ID
  return UserModel.findByIdAndDelete(id);
  // If you need to delete by condition use: next
  // return UserModel.deleteOne({ _id: id });
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
