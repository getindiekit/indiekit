import process from 'node:process';
import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import test from 'ava';
import nock from 'nock';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import {defaultConfig} from '../../../config/defaults.js';
import {authorise} from '../../../lib/middleware/authorisation.js';

const {mockRequest, mockResponse} = mockReqRes;

test.beforeEach(t => {
  t.context = {
    accessToken: {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create update delete media',
    },
    bearerToken: process.env.TEST_BEARER_TOKEN,
    me: process.env.TEST_PUBLICATION_URL,
  };
});

test('Throws error', async t => {
  const request = mockRequest({
    method: 'post',
  });
  const response = mockResponse();
  const next = sinon.spy();

  await authorise(defaultConfig.publication)(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});

test('Saves token to locals', async t => {
  nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, t.context.accessToken);
  const request = mockRequest({headers: {authorization: `Bearer ${t.context.bearerToken}`}});
  const response = mockResponse({locals: {publication: {}}});
  const next = sinon.spy();
  defaultConfig.publication.me = process.env.TEST_PUBLICATION_URL;

  await authorise(defaultConfig.publication)(request, response, next);

  t.is(defaultConfig.publication.accessToken.me, t.context.me);
  t.true(next.calledOnce);
});
