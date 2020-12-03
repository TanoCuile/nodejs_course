const {FileStorage} = require('./file_storage.class');
const drivers = require('./storage_driver');

const fileStorage = new FileStorage(drivers);

module.exports = fileStorage;
