const path = require('path');

/**
 * @param {HandleUsersPayload} payload
 */
function handleUserInfo({ users }) {
  console.log('Handle...', users);
  return Promise.resolve();
}

module.exports = { handleUserInfo };

/**
 * @typedef {{"users": {
 *    name: string,
 *    id: number
 * }[]}} HandleUsersPayload
 */
