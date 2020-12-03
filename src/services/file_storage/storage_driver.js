// We are using Google Cloud Storage as cloud storage service
const {Storage} = require('@google-cloud/storage');
const DEFAULT_BUCKET_NAME = 'node-course-test-bucket';
// Firstly we need to initialize `Storage` it contains connection configration
const storage = new Storage();
// Then we need to have Bucket object for working with particular bucket
// The 'bucket' is something like SQL table or file system folder where stored our files on cloud
exports.bucket = storage.bucket(DEFAULT_BUCKET_NAME);
exports.storage = storage;
