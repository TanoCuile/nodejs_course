const sinon = require('sinon');
const should = require('should');
const {
  FileStorage,
} = require('../../../src/services/file_storage/file_storage.class');

describe('FileStorage', () => {
  /**
   * @type {FileStorage}
   */
  let storage;
  let mockGoogleStorage = {};
  let mockGoogleBucket = {};
  beforeEach(() => {
    mockGoogleStorage = {};
    mockGoogleBucket = {};
    storage = new FileStorage({
      bucket: mockGoogleBucket,
      storage: mockGoogleStorage,
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('#listBuckets', () => {
    it('should return existing bucket names', async () => {
      mockGoogleStorage['getBuckets'] = () =>
        Promise.resolve([[{name: 'Some Buncket'}, {name: 'Some Buncket 2'}]]);

      const response = await storage.listBuckets();

      should(response).be.eql(['Some Buncket', 'Some Buncket 2']);
    });

    it('should catch error correctly', async () => {
      mockGoogleStorage['getBuckets'] = () => {
        throw new Error('Some test error');
      };

      const spyedLogger = sinon.spy(console, 'error');

      await should(storage.listBuckets()).be.resolved();
      //   should(
      //     spyedLogger.calledWithExactly('ERROR:', new Error('Some test error'))
      //   ).be.equal(true);

      const call = spyedLogger.getCall(0);
      should(spyedLogger.getCalls().length).be.equal(1);
      should(call.args[0]).be.equal('ERROR:');
      should(call.args[1]).be.instanceOf(Error);
      should(call.args[1].message).be.equal('Some test error');
    });
  });
});
