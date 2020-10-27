function serverRunner({port, host}) {
  if (typeof port !== 'number') {
      throw new Error();
  }
  return Promise.resolve();
}

const [,,port, host] = process.argv;

serverRunner({host, port: Number(port)}).then(() => {
  console.log("Server runned on: ", port, host)
});