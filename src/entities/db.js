const {Sequelize} = require('sequelize');

// Initialize database connection
const sequelize = new Sequelize({
  dialect: 'mysql',
  port: 3307,
  host: 'localhost',
  username: 'root',
  password: 'example',
  database: 'node_course_1',
  // Define number of db connections
  pool: {
    max: 5,
    min: 2,
  },
});

module.exports.getInstance = () => {
  return sequelize;
};
