const sinon = require('sinon');
const should = require('should');
const example = require('../../../../src/server/example/updated');

const fixtures = {
  success: {
    name: 'John',
    email: 'stri_some@gmail.com',
    subscription: 'Flowers',
    password: 'password',
    token: 'SOME_TOKEN',
  },
  failures: [
    {
      label: 'email',
      fixture: {
        name: 'John',
        email: 'stri_some_gmail.com',
        subscription: 'Flowers',
        password: 'password',
        token: 'SOME_TOKEN',
      },
    },
    {
      label: 'name',
      fixture: {
        name: 'RJ',
        email: 'stri_some@gmail.com',
        subscription: 'Flowers',
        password: 'password',
        token: 'SOME_TOKEN',
      },
    },
  ],
};

function validateFailure(label, fixture) {
  it(`field '${label}' should fail validation`, () => {
    // sinon.spy(obj, 'method') - will spy method of object
    // sinon.spy() - will return similar to `sinon.stub`
    // sinon.spy(...) returns spied instance
    const nextFunction = sinon.spy();

    should(() =>
      example.validatePostContact(
        {
          body: fixture,
        },
        null,
        nextFunction
      )
    ).not.throw();

    const error = nextFunction.getCall(0).args[0];

    should(error.message).be.equal(
      `missing {'${label}': ''} is required name field `
    );
  });
}

describe('#validatePostContact', () => {
  before(function () {
    this.timeout(30000);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('request should be valid', () => {
    const nextFunction = sinon.spy();

    const stubedValidation = sinon.stub(example, 'getValidation');
    stubedValidation.returns({});

    should(() =>
      example.validatePostContact(
        {
          body: fixtures.success,
        },
        null,
        nextFunction
      )
    ).not.throw();

    should(nextFunction.calledOnceWithExactly()).be.equal(true);
  });

  fixtures.failures.forEach(({label, fixture}) =>
    validateFailure(label, fixture)
  );
});
