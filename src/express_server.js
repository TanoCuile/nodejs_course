const express = require("express");
const jsonBodyParser = require('json-body-parser'); 

const users = [];

function handleUserInfo() {
  console.log('Handle...');
  return Promise.resolve();
}

// request -> system_functions -> express_router -> [m1, m2, m3 ..., mn] -> handler


function runServer({ host, port }) {
  return new Promise((resolve) => {
    const app = express();

    app.use(jsonBodyParser);

    app.use('/users', (req, res, next) => {
      for (const user of req.body.users) {
        if (typeof user.id !== 'number'){
          next(new Error());
        }
      }

      next();
    })

    app.post('/users', (req, res) => {
      /**
       * @type {{users: {name: string, id: number}[]}}
       */
      const newUserInfo = req.body;

      handleUserInfo(newUserInfo);
      
      return res.json({
        status: 'Ok',
        data: [{
          name: 'Ben',
          id: 1
        }]
      });
    });

    app.post('/2', (req, res) => {
      return res.json({
        status: 'Ok',
        data: [{
          name: 'Bob',
          id: 2
        }]
      })
    });

    return app.listen(port, host, () => {
      console.log("Listening...");
      resolve();
    });
  });
}

module.exports = {
  runServer: runServer,
};
