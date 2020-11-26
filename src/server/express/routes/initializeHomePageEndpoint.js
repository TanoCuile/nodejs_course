const {join} = require('path');
const {promises: fs} = require('fs');
const {getUsers} = require('@services/handle.users_info');
const {getFiles} = require('../../../services/file_storage');

function initializeHomePageEndpoint(app) {
  app.get('/', async (req, res) => {
    const {page, sort, sort_direction: sortDirection} = req.query || {};
    res.setHeader('Content-Type', 'text/html');

    const {users} = await getUsers({
      page: Number(page) || 1,
      sort: sort || 'age',
      sortDirection: Number(sortDirection) || 1,
    });

    // const images = await fs.readdir(join(process.cwd(), 'public', 'images'));
    const images = await getFiles();

    return res.render('index.html.ejs', {
      name: req.user ? req.user.getFullName() : 'John Doe',
      images,
      users,
    });
  });
}
exports.initializeHomePageEndpoint = initializeHomePageEndpoint;
