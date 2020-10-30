const {runUserCommand} = require('./src/commandProcessor');
const {runServer} = require('./src/server/express_server');

/**
 * @param {RunServerPayload} payload
 * @returns {Promise<any>}
 */
function runServerCallaback(payload) {
  return runServer(payload).then(() => {
    console.log('It works on', payload.host, payload.port);
  });
}

runUserCommand(runServerCallaback);
