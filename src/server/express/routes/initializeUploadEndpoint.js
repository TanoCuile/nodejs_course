const {join} = require('path');
const {promises: fs} = require('fs');
const imagemin = require('imagemin');
const imageminPNG = require('imagemin-pngquant');
const imageminJPG = require('imagemin-jpegtran');
const {multer} = require('./index');
const {upload} = require('../../../services/file_storage');

function initializeUploadEndpoint(app) {
  app.post('/upload', multer.single('custom_image'), async (req, res) => {
    /**
     * @type {string}
     */
    const file = req.file;

    // Validate type of uploaded file
    if (validateFile(file)) {
      return processFailedValidation(res);
    }

    /**
     * @type {string}
     */
    const fileName = file.originalname;
    /**
     * @type {string}
     */
    const multerTemporaryFilePath = file.path;

    /**
     * @type {[{destinationPath: string}]}
     */
    const finalImagePath = await minifyFileAndGetDestinationPath(
      multerTemporaryFilePath
    );

    // We removing temporary file
    // Usually better to do that asynchroniously
    await removeTemporaryFiles(multerTemporaryFilePath);
    // Also we need to move minified file into public folder
    // where it can be accesible from browser by `express.static`
    await moveFileToDestinationLocation(finalImagePath, fileName);

    // We wat to redirect to home page(because we not have separated page)
    return res.redirect('/');
  });
}
exports.initializeUploadEndpoint = initializeUploadEndpoint;

async function moveFileToDestinationLocation(finalImagePath, fileName) {
  // Cloud functionality
  await upload(finalImagePath, fileName);
  fs.unlink(finalImagePath);
  // File system functionality
  // await fs.rename(
  //   join(process.cwd(), finalImagePath),
  //   join(process.cwd(), 'public', 'images', fileName)
  // );
}

async function removeTemporaryFiles(multerTemporaryFilePath) {
  await fs.unlink(multerTemporaryFilePath);
}

async function minifyFileAndGetDestinationPath(multerTemporaryFilePath) {
  const fileInfo = await imagemin([multerTemporaryFilePath], {
    destination: 'public/images',
    plugins: [imageminJPG(), imageminPNG()],
  });

  /**
   * @type {string}
   */
  const finalImagePath = fileInfo[0].destinationPath;
  return finalImagePath;
}

function processFailedValidation(res) {
  return res.status(400).json({status: 'Error', message: 'Not supported type'});
}

function validateFile(file) {
  return !['image/jpeg', 'image/png'].includes(file.mimetype);
}
