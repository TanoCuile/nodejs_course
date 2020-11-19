const {Model, DataTypes} = require('sequelize');
const {getInstance} = require('../db');

class Session extends Model {
  putData(data) {
    this.setDataValue('data', JSON.stringify(data));
  }

  getData() {
    return this.getDataValue('data');
  }
}

Session.init(
  {
    data: {
      type: DataTypes.TEXT,
      field: 'session_data',
      defaultValue: '{}'
    },
  },
  {sequelize: getInstance(), modelName: 'session'}
);
module.exports.Session = Session;
