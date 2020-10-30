const yargs = require('yargs');
const {
  HOST_PARAMETER_NAME,
  PORT_PARAMETER_NAME,
  hostParameterConfiguration,
  portParameterConfigurtion,
} = require('./config');

/**
 * @param {(payload: RunServerPayload) => Promise<any>} runServerCallaback
 */
function runUserCommand(runServerCallaback) {
  yargs
    .scriptName('run')
    .usage('$0 <cmd> [args]')
    .command(
      `run [${HOST_PARAMETER_NAME}] [${PORT_PARAMETER_NAME}]`,
      'Run server',
      (command) => {
        // command.option('option', {}) // --key=value
        command.positional(HOST_PARAMETER_NAME, hostParameterConfiguration);
        command.positional(PORT_PARAMETER_NAME, portParameterConfigurtion);
      },
      (args) => {
        runServerCallaback(args);
      }
    )
    .help().argv;
}
exports.runUserCommand = runUserCommand;
