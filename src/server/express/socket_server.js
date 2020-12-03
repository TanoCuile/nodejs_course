const {Server} = require('socket.io');

class SocketUser {
  /**
   * @param {import('socket.io').Socket} clientSocket
   */
  constructor(clientSocket) {
    this.clientSocket = clientSocket;
    clientSocket.on('hello', this.handleHello.bind(this));
    clientSocket.on('alive', this.handleAlive.bind(this));
  }

  handleHello() {
    this.clientSocket.emit('hi', {
      some_data: 1,
    });
  }

  handleAlive() {
    this.clientSocket.emit('ok', {});
  }

  /**
   * @param {{fileName: string}} param0
   */
  notifyFileUploaded({fileName}) {
    this.clientSocket.emit('file_uploaded', {fileName});
  }
}

/**
 * @type {{[key: string]: SocketUser}}
 */
const users = {};

function initializeSocketServer(httpServer) {
  const socketServer = new Server(httpServer, {
    transports: ['websocket'],
  });

  // Add namespace to be able to supplort different groups of web_sockets
  const namespace = socketServer.of('/images');

  namespace.on('connection', (socket) => {
    const socketUser = new SocketUser(socket);
    socket.user = socketUser;
    users[socketUser.clientSocket.id] = socketUser;

    socket.on(
      'disconnect',
      function () {
        delete users[this.id];
      }.bind({id: socket.id})
    );
  });
}

/**
 * @param {{fileName: string}} payload
 */
function notifyAboutUpload(payload) {
  Object.keys(users).forEach((socketUserName) => {
    users[socketUserName].notifyFileUploaded(payload);
  });
}

module.exports = {initializeSocketServer, notifyAboutUpload};
