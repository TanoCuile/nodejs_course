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

describe('services > handle.user_info > handle.user_info.mongo', () => {
  describe('#getUsers', () => {
    let aggregateStub;
    let response;
    beforeEach(async () => {
      // Spy will check calls count arguments etc.
      // But it will call original functionality
      // sinon.spy()
      // Stub will replace original original functionality by defined
      // And also it will calculate count of calls and arguments
      aggregateStub = sinon.stub(UserModel, 'aggregate');
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

    afterEach(() => {
      sinon.restore();
    });

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
