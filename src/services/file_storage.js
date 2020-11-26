// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const DEFAULT_BUCKET_NAME = 'node-course-test-bucket';

// It looks into env variable `GOOGLE_APPLICATION_CREDENTIALS`
// And it will load key by path on `GOOGLE_APPLICATION_CREDENTIALS`
// It looks like
// new SystemStorage(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS))

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();
const bucket = storage.bucket(DEFAULT_BUCKET_NAME);

// Makes an authenticated API request.
async function listBuckets() {
  try {
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach((bucket) => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}

async function getFiles() {
  return bucket.getFiles().then(([files]) => {
    return files.map((file) => file.name);
  });
}

/**
 * @param {string} pathToFile
 * @param {[string]} finalFileName
 *
 * @returns {Promise<boolean>}
 */
async function upload(pathToFile, finalFileName) {
  const info = await bucket.upload(process.cwd() + '/' + pathToFile);
  if (finalFileName) {
    await bucket.file(info[0].name).rename(finalFileName);
  }
  return true;
}

/**
 * @param {string} fileName
 *
 * @returns {Promise<boolean>}
 */
async function exists(fileName) {
  const exists = await bucket.file(fileName).exists();

  return !!exists[0];
}

/**
 * @param {string} fileName
 *
 * @returns {Promise<Buffer>}
 */
async function download(fileName) {
  return bucket
    .file(fileName)
    .download()
    .then((data) => data[0]);
}

module.exports = {
  upload,
  download,
  exists,
  getFiles,
};
