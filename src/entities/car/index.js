const {Model, DataTypes} = require('sequelize');
const {getInstance} = require('../db');

class Car extends Model {
  static generateRandomCar() {
    return {
      maker: getRandomMaker(),
      model: getRandomModel(),
      year: getRandomYear(),
    };
  }

  getFullName() {
    return (
      this.getDataValue('maker') +
      ' - ' +
      this.getDataValue('model') +
      '(' +
      this.getDataValue('year') +
      ')'
    );
  }
}

Car.init(
  {
    maker: {
      type: DataTypes.STRING(32),
      field: 'maker',
    },
    model: {
      type: DataTypes.STRING(32),
      field: 'model',
    },
    year: {
      type: DataTypes.INTEGER,
      field: 'creation_year',
    },
  },
  {sequelize: getInstance(), modelName: 'car'}
);

function getRandomYear() {
  return Math.floor(Math.random() * 80 + 1955);
}

function getRandomMaker() {
  const names = ['Tesla', 'BMW', 'Ford', 'VW'];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomModel() {
  const names = ['I30', 'Astra', 'Fusion', 'Fiest', 'Golf', 'Leaf', 'Volt'];
  return names[Math.floor(Math.random() * names.length)];
}

module.exports.Car = Car;
