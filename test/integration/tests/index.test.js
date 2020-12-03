require('module-alias/register');
const request = require('supertest-promised');
const should = require('should');
const {runServer} = require('../../../src/server/express');

describe('Index route test', () => {
  /**
   * @type {import('express').Application}
   */
  let app;
  before(async () => {
    app = await runServer();
  });
  it('call index endpoint', async () => {
    const content = await request(app).get('/').expect(200).end().get();
  });
});
