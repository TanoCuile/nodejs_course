const yargs = require("yargs");
const { callServer } = require("./serverRequester");
const { serverRunner } = require("./serverRunner");

const params = yargs
  .scriptName("run")
  .usage("$0 <cmd> [args]")
  .command(
    "run [host] [port]",
    "Run server command",
    (yargs) => {
      yargs.positional("host", {
        type: "string",
        default: "localhost",
        describe: "server address",
      });
      yargs.positional("port", {
        type: "number",
        default: 3000,
        describe: "port for server listening",
      });
    },
    /**
     * 
     * @param {{ host: string, port: number }} argv 
     */
    function (argv) {
      serverRunner(argv);
    }
  )
  .command(
    "req [host] [port]",
    "Send request to server command",
    (yargs) => {
      yargs.positional("host", {
        type: "string",
        default: "localhost",
        describe: "server address",
      });
      yargs.positional("port", {
        type: "number",
        default: 3000,
        describe: "port for server listening",
      });
    },
    /**
     * 
     * @param {{ host: string, port: number }} argv 
     */
    function (argv) {
      callServer(argv);
    }
  )
  .help().argv;

console.log(params);
