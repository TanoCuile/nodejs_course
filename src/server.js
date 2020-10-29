const http = require("http");


/**
 * @param {import('http').ServerResponse} res
 */
function sendResponse(res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
 
  const body = JSON.stringify({ status: "OK" });

  res.write(body, () => {
    res.end();
  });
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
function requestListener(req, res) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req.on('data', (data) => {
      const users = JSON.parse(data.toString());
    });
    
    req.on('error', () => {
      res.writeHead(500);
    });

    req.on('end', () => {
      console.log('Request finished');
    });
  }

  sendResponse(res);
}

/**
 * @param {{host: string, port: number}} payload
 */
function runServer({ host, port }) {
  http.createServer(requestListener).listen(port, host);
  return Promise.resolve();
}

module.exports = {
  runServer: runServer,
};
