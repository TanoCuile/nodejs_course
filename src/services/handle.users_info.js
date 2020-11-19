const bcrypt = require('bcrypt');
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
    where = {id: carId};
  }
  return {
    users: await User.findAll({
      include: [
        {
          model: Car,
          as: 'cars',
          where,
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
 * Provides required functionality for register new user
 *
 * @param {{userInfo: {
 *    first_name: string,
 *    last_name: string,
 *    email: string,
 *    password: string,
 * }}} payload
 */
async function registerNewUser({userInfo}) {
  const foudUsers = await User.findAll({where: {email: userInfo.email}});

  if (foudUsers.length) {
    throw new Error('Email exists!');
  }

  const newUser = User.create({
    firstName: userInfo.first_name,
    lastName: userInfo.last_name,
    email: userInfo.email,
    password: await getCryptedUserPassword(userInfo),
  });

  return newUser;
}

async function getCryptedUserPassword(userInfo) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(userInfo.password, salt);
}

/**
 * Provides required functionality for login
 *
 * @param {{userInfo: {
 *    email: string,
 *    password: string,
 * }}} payload
 */
async function loginUser({userInfo}) {
  const user = await User.findOne({where: {email: userInfo.email}});

  if (await comparePasswords(user, userInfo)) {
    return user;
  }

  throw new Error('Invalid credentials');
}

async function comparePasswords(user, userInfo) {
  return bcrypt.compare(userInfo.password, user.password);
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
  registerNewUser,
  loginUser,
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
