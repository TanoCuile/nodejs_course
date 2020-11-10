const monggose = require('mongoose');

module.exports = {
  initializeDataBase: () =>
  // Connect local client to Atlas database `node_course` by our credentials
    monggose.connect('mongodb+srv://course_user:goit@nodejscoursecluster.6lx5g.mongodb.net/node_course', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  ,
};
