import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import test from 'ava';
import nock from 'nock';
import supertest from 'supertest';
import {getFixture} from '../helpers/fixture.js';
import {serverConfig} from '../../../indiekit/config/server.js';
import {Indiekit} from '../../../indiekit/index.js';
import {GithubStore} from '../../../store-github/index.js';

test.beforeEach(async t => {
  const indiekit = new Indiekit();
  const config = await indiekit.init();
  config.publication.me = process.env.TEST_PUBLICATION_URL;
  config.publication.store = new GithubStore({
    token: 'abc123',
    user: 'user',
    repo: 'repo'
  });
  const request = supertest(serverConfig(config));

  t.context.token = process.env.TEST_BEARER_TOKEN;
  t.context.request = request.post('/media');
});

test('Uploads file', async t => {
  const scope = nock('https://api.github.com')
    .put(uri => uri.includes('.jpg'))
    .reply(200, {commit: {message: 'Message'}});
  const response = await t.context.request
    .accept('application/json')
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`)
    .attach('file', getFixture('photo.jpg', false), 'photo.jpg');
  t.is(response.status, 201);
  t.regex(response.headers.location, /\b.jpg\b/);
  t.regex(response.body.description, /\bMedia uploaded\b/);
  t.is(response.body.type, 'photo');
  scope.done();
});

test('Returns 400 if no file included in request', async t => {
  const response = await t.context.request
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`);
  t.is(response.error.status, 400);
  t.is(response.error.text, 'No file included in request');
});

test('Returns 400 if access token does not provide adequate scope', async t => {
  const response = await t.context.request
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN_NOSCOPE}`);
  t.is(response.error.status, 400);
  t.is(response.error.text, 'Access token does not meet requirements for requested scope (create or media)');
});
