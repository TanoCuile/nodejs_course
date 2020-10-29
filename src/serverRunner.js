const http = require("http");
const fs = require("fs/promises");
const path = require("path");

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 *
 * @returns {import('http').ServerResponse}
 */
const requestListener = (req, res) => {
  console.log(req.url);
  console.log(req.headers);
  console.log(req.method);
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    if (body && body.length) {
      console.log(">>>>", JSON.parse(body));
    }
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    const pathToData = path.resolve(__dirname, "..", "data", "data.json");
    fs.readFile(pathToData).then((data) => {
      res.write(data);
      res.end();
    });
  });
  return res;
};

exports.serverRunner = function serverRunner({ port, host }) {
  if (typeof port !== "number") {
    throw new Error();
  }
  const server = http.createServer(requestListener);

  return server.listen(port, host, () => {
    return Promise.resolve();
  });
};
