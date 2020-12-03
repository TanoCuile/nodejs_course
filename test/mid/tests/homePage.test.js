const should = require('should');
const sinon = require('sinon');
const rewire = require('rewire');
const {
  initializeHomePageEndpoint,
} = require('../../../src/server/express/routes/initializeHomePageEndpoint');
const {UserModel} = require('../../../src/models/user');
const storageIndex = require('../../../src/services/file_storage/index');

describe('Check `/` alias functionality', () => {
  /**
   * @type {import('sinon').SinonSandbox}
   */
  let sandbox;
  before(() => {
    storageIndex.storage = {};
    storageIndex.bucket = {};
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#initializeHomePageEndpoint', () => {
    let appArguments;
    beforeEach(() => {
      initializeHomePageEndpoint({
        get: (...args) => {
          appArguments = args;
        },
      });
    });
    it('should map home page to `/`', () => {
      should(appArguments[0]).be.equal('/');
    });
    it('handler should render proper page', async () => {
      storageIndex.bucket = {
        getFiles: () => Promise.resolve([[{name: 'SomeFileName1'}]]),
      };
      aggregateStub = sinon.stub(UserModel, 'aggregate');
      aggregateStub.resolves([
        {
          user_field: '127',
        },
        {
          user_field: '276',
        },
      ]);
      const handler = appArguments[1];

      const renderStub = sandbox.stub();
      const setHeaderStub = sandbox.stub();
      // const storageStub = sandbox.stub(googleStorageLibrary.Storage, 'Storage');

      await handler(
        {
          query: {
            page: 123,
            sort: 'SOME_OTHER_FIELD',
            sort_direction: 23,
          },
        },
        {
          render: renderStub,
          setHeader: setHeaderStub,
        }
      );

      should(
        renderStub.calledOnceWith('index.html.ejs', {
          name: 'John Doe',
          images: ['SomeFileName1'],
          users: [
            {
              user_field: '127',
            },
            {
              user_field: '276',
            },
          ],
        })
      ).be.equal(true);
    });
  });
});
