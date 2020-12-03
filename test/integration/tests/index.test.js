require('module-alias/register');
const request = require('supertest-promised');
const should = require('should');
const {promises: fs} = require('fs');
const {runServer} = require('../../../src/server/express');
const storageIndex = require('../../../src/services/file_storage/index');
const {resolve} = require('path');

describe('Index route test', function () {
  // You can set up timeout for your tests
  // this.timeout(1000);
  /**
   * @type {import('express').Application}
   */
  let app;
  before(async () => {
    app = await runServer();
    console.log('>>>>>>');
  });

  it('call index endpoint', async () => {
    // As far as it's not real server - we can mock
    storageIndex.bucket = {
      getFiles: () => Promise.resolve([[{name: 'SomeFileName1'}]]),
    };

    // Send pseudo request
    const content = await request(app).get('/').set('Cookie', '').expect(200);

    // Check required parts on loaded page
    should(content.text.indexOf('src="/img/SomeFileName1"')).be.greaterThan(-1);
  });
});
