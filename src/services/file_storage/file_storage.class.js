// It looks into env variable `GOOGLE_APPLICATION_CREDENTIALS`
// And it will load key by path on `GOOGLE_APPLICATION_CREDENTIALS`
// It looks like
// new SystemStorage(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS))

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.

// const plainIds = [1, 2, 3264723, 384837];
// const promises = plainIds.map(() => new Promise((resolve) => {
//   // SOME CODE HERE
//   return resolve();
// } ));

// // Some other code

// await Promise.all(promises);

class FileStorage {
  /**
   * @param {{
   *    bucket: import('@google-cloud/storage').Bucket,
   *    storage: {
   *      getBuckets: () => Promise<[{
   *        name: string
   *      }[]]>
   *    },
   * }} payload
   */
  constructor({bucket, storage}) {
    this.bucket = bucket;
    this.storage = storage;
  }

  /**
   * @returns {Promise<string[]>}
   */
  async listBuckets() {
    try {
      const [buckets] = await this.storage.getBuckets();

      return buckets.map((bucket) => bucket.name);
    } catch (err) {
      console.error('ERROR:', err);
    }
  }

  /**
   * @returns {Promise<string[]>}
   */
  async getFiles() {
    return this.bucket.getFiles().then(([files]) => {
      return files.map((file) => file.name);
    });
  }

  /**
   * @param {string} pathToFile
   * @param {[string]} finalFileName
   *
   * @returns {Promise<boolean>}
   */
  async upload(pathToFile, finalFileName) {
    const info = await this.bucket.upload(process.cwd() + '/' + pathToFile);

    // Rename functionality, if we uploading temporary file with random name
    if (finalFileName) {
      await this.bucket.file(info[0].name).rename(finalFileName);
    }

    return true;
  }

  /**
   * @param {string} fileName
   *
   * @returns {Promise<boolean>}
   */
  async exists(fileName) {
    const exists = await this.bucket.file(fileName).exists();

    return !!exists[0];
  }

  /**
   * @param {string} fileName
   *
   * @returns {Promise<Buffer>}
   */
  async download(fileName) {
    return (await this.bucket.file(fileName).download())[0];
  }
}

module.exports = {FileStorage};
