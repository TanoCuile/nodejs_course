(function () {
  console.log('We can run js for main');

  /**
   * @type {import('socket.io-client').Socket}
   */
  const serverSocket = io('/images', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
  });
  serverSocket.on('connect', () => {
    console.log('Connection');
  });
  serverSocket.emit('hello', {});

  serverSocket.on('hi', (data) => {
    console.log('Hi from server', data);
  });

  serverSocket.on('file_uploaded', ({fileName}) => {
    const imagesContainer = document.getElementById('images');
    imagesContainer.innerHTML +=
      '<div><h4>' +
      fileName +
      '</h4><img src="/img/' +
      fileName +
      '" style="width: 100px; height: 100px" /></div>';
  });
})();
