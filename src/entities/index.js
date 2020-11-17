const {getInstance} = require('./db');
const {User} = require('./user');
const {Car} = require('./car');

module.exports.initializeDb = async function initializeBd() {
  Car.belongsTo(User);
  // Sync all initialized models with database
  // Bad pattern: use migrations
  // Good for development
  await getInstance().sync({force: true}); // can drop data
};

(async () => {
  await this.initializeDb();
  const generatedData = User.generateRandomUser();
  const storedUser = await User.create(generatedData);

  console.log(storedUser.getFullName());

  console.log(storedUser.toJSON());

  const generatedCar = Car.generateRandomCar();
  generatedCar.userId = storedUser.id;
  const storedCar = await Car.create(generatedCar);

  console.log(generatedCar, storedCar.getFullName());

  console.log(storedCar.toJSON());
})();
