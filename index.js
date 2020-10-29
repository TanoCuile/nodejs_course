const yargs = require("yargs");
const { runServer } = require("./src/server");

const parameters = yargs
  .scriptName("run")
  .usage("$0 <cmd> [args]")
  .command(
    "run [host] [port]",
    "Run server",
    (command) => {
      command.positional("host", {
        default: "localhost",
        description: "Host for running server",
        type: "string",
      });
      command.positional("port", {
        description: "Port for running server",
        type: "number",
        default: 3000,
      });
    },
    (args) => {
      runServer(args).then(() => {
        console.log('It works on', args.host, args.port);
      })
    }
  )
  .help().argv;
