const {Model, DataTypes} = require('sequelize');
const {getInstance} = require('../db');

class User extends Model {
  static generateRandomUser() {
    return {
      firstName: getRandomFName(),
      lastName: getRandomLName(),
      birthday: new Date(getRandomYear(), getRandomMonth(), getRandomDay()),
    };
  }

  getFullName() {
    return this.getDataValue('firstName') + ' ' + this.getDataValue('lastName');
  }
}

User.init(
  {
    firstName: {
      type: DataTypes.STRING(64),
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(64),
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING(256),
      field: 'email',
      unique: true,
    },
    password: {
      type: DataTypes.STRING(256),
      field: 'password',
    },
    birthday: {
      type: DataTypes.DATE,
      field: 'date_of_birth',
    },
  },
  {sequelize: getInstance(), modelName: 'user'}
);

function getRandomMonth() {
  return Math.floor(Math.random() * 12);
}

function getRandomYear() {
  return Math.floor(Math.random() * 80 + 1955);
}

function getRandomDay() {
  return Math.floor(Math.random() * 28);
}

function getRandomFName() {
  const names = ['Andrew', 'Tom', 'Sonia', 'Ted', 'Mary'];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomLName() {
  const names = ['Smith', 'Potter', 'Dep'];
  return names[Math.floor(Math.random() * names.length)];
}

module.exports.User = User;
