const { promises: fs } = require('fs');
const { PATH_TO_DATA_FILE } = require('../config');
const { UserModel } = require('../models/user');

/**
 * @returns {Promise<{users: User[]}>}
 */
async function getUsers() {
  return JSON.parse((await fs.readFile(PATH_TO_DATA_FILE)).toString());
}

function saveDataToFile(data) {
  return fs.writeFile(PATH_TO_DATA_FILE, JSON.stringify(data));
}

/**
 * @param {User[]} users
 * @param {number} id
 *
 * @returns {User}
 */
function findUserInList(users, id) {
  return users.find((user) => user.id === id);
}

/**
 * @param {number} id
 *
 * @returns {Promise<User>}
 */
async function getUserById(id) {
  const { users } = await getUsers();
  return findUserInList(users, id);
}

async function updateUserById(id, userInfo) {
  if (userInfo.id) {
    throw new Error('You cannot change user.id');
  }
  const data = await getUsers();
  const { users } = data;
  const user = findUserInList(users, id);
  Object.assign(user, userInfo);

  saveDataToFile(data);
}

function validateUserCreation(data, user) {
  const duplicates = data.users.filter(
    (storedUser) => storedUser.id === user.id,
  );

  if (duplicates.length) {
    throw new Error(`It's duplicate: ${JSON.stringify(user)}`);
  }
}

/**
 * @param {HandleUsersPayload} payload
 */
async function handleUserInfo({ user }) {
  return UserModel.create({
    name: user.name,
  });
}

module.exports = {
  handleUserInfo, getUsers, getUserById, updateUserById,
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
