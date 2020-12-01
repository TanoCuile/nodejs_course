// Lightweight library for better assertion
const should = require('should');
// Library for mocking, stubing etc...
const sinon = require('sinon');
// We are importing `UserModel` for mocking it in future
const {UserModel} = require('../../../../src/models/user');
// Importing service for providing tests
const service = require('../../../../src/services/handle.users_info/handle.users_info.mongo');
// Initialize sandbox for making
// const sandbox = sinon.sandbox();

// `describe` blocks used for:
// 1. grop test statements
// 2. provide more information about tested scenario
describe('services > handle.user_info > handle.user_info.mongo', () => {
  // `describe` blocks can organize deep structure
  describe('#getUsers', () => {
    let aggregateStub;
    let response;
    // `beforeEach` - will be called before each `it` statement on current `describe` block
    beforeEach(async () => {
      // Spy will check calls count arguments etc.
      // But it will call original functionality
      // sinon.spy()
      // Stub will replace original original functionality by defined
      // And also it will calculate count of calls and arguments
      aggregateStub = sinon.stub(UserModel, 'aggregate');
      // Setup response from stub, in our case it's Promise - so we are using `resolves` method
      aggregateStub.resolves([
        {
          user_field: '1',
        },
        {
          user_field: '2',
        },
      ]);

      response = await service.getUsers({
        page: 10,
        sort: 'some_field_1',
        sortDirection: 10,
      });
    });

    // `afterEach` - called after each statement on closest `describe` block
    afterEach(() => {
      // Me must remove all spyes and stubs to prepare it for next tests
      sinon.restore();
    });

    // `it` statement contains assertions for one test case
    // As smaller your `it` stetements so better your unit tests
    it('Should return users by aggregation', async () => {
      // Next wil not work because `equal` only for scalar comparison
      // @see: https://shouldjs.github.io/#assertion-equal
      //   should(response).be.equal([
      //     {
      //       user_field: '1',
      //     },
      //     {
      //       user_field: '2',
      //     },
      //   ]);
      should(response).be.eql({
        users: [
          {
            user_field: '1',
          },
          {
            user_field: '2',
          },
        ],
      });
    });

    it('Should pass correct arguments', async () => {
      should(
        aggregateStub.calledOnceWithExactly([
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'user',
              as: 'comments',
            },
          },
          {
            $sort: {
              some_field_1: 10,
            },
          },
          // Keep in mind that aggregation works `chain by chain`
          // And if we put $limit before $skip - pagination will not works
          {
            $skip: 45,
          },
          {
            $limit: 5,
          },
        ])
      ).be.equal(true);
    });
  });
});
