const {getUsers} = require('../../../services/handle.users_info');
const storage = require('../../../services/file_storage');

async function handleGetHomePage(req, res) {
  console.log('>>>>');
  const {page, sort, sort_direction: sortDirection} = req.query || {};
  res.setHeader('Content-Type', 'text/html');
  console.log('>>>> 2');

  const {users} = await getUsers({
    page: Number(page) || 1,
    sort: sort || 'age',
    sortDirection: Number(sortDirection) || 1,
  });

  console.log('>>>> 3');
  // const images = await fs.readdir(join(process.cwd(), 'public', 'images'));
  const images = await storage.getFiles();
  console.log('>>>> 4', {
    name: req.user ? req.user.getFullName() : 'John Doe',
    images,
    users,
  });

  return res.render('index.html.ejs', {
    name: req.user ? req.user.getFullName() : 'John Doe',
    images,
    users,
  });
}

function initializeHomePageEndpoint(app) {
  app.get('/', handleGetHomePage);
}

exports.initializeHomePageEndpoint = initializeHomePageEndpoint;
exports.handleGetHomePage = handleGetHomePage;
