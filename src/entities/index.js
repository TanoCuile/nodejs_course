const {getInstance} = require('./db');
const {User} = require('./user');
const {Car} = require('./car');
async function initializeDataBase() {
  Car.belongsTo(User);
  User.hasMany(Car);
  // Sync all initialized models with database
  // Bad pattern: use migrations
  // Good for development
  await getInstance().sync({force: false}); // can drop data
}
module.exports.initializeDataBase = initializeDataBase;

(async () => {
  await initializeDataBase();
  // const generatedData = User.generateRandomUser();
  // const storedUser = await User.create(generatedData);

  // console.log(storedUser.getFullName());

  // console.log(storedUser.toJSON());

  // const generatedCar = Car.generateRandomCar();
  // generatedCar.userId = storedUser.id;
  // const storedCar = await Car.create(generatedCar);

  // console.log(generatedCar, storedCar.getFullName());

  // console.log(storedCar.toJSON());
})();
