const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
exports.bucket = storage.bucket(DEFAULT_BUCKET_NAME);
