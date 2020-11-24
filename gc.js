// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();
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

async function upload() {
  const bucket = storage.bucket('node-course-test-bucket');

  const info = await bucket.upload(process.cwd() + '/README.md');
  console.log(info[0].id, info[0].name);
}

async function exists() {
  const bucket = storage.bucket('node-course-test-bucket');

  const exists = await bucket.file('README.md').exists();
  console.log(exists[0]);
  if (!exists[0]) {
    throw new Error('No file');
  }
}

async function download() {
  const bucket = storage.bucket('node-course-test-bucket');

  const content = await bucket.file('README.md').download();
  console.log(content[0].toString());
}

listBuckets().then(upload).then(exists).then(download);
