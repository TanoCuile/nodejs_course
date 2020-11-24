const monggose = require('mongoose');
const {MONGO_DB_URL} = require('@/config');

module.exports = {
  /**
   * Function for initialize database connection through mongoose interface
   */
  initializeDataBase: () =>
    // Connect local client to
    monggose
      .connect(MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error)),
};
