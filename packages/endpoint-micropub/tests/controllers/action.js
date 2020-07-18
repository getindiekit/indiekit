import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import test from 'ava';
import nock from 'nock';
import supertest from 'supertest';
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

  t.context.request = request.post('/micropub');
});

test.serial('Creates post', async t => {
  const authScope = nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'create'
    });
  const hostScope = nock('https://api.github.com')
    .put(uri => uri.includes('foobar'))
    .reply(200, {commit: {message: 'Message'}});
  const response = await t.context.request
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`)
    .send('h=entry')
    .send('name=foobar')
    .send('content=Micropub+test+of+creating+a+basic+h-entry');
  t.is(response.status, 202);
  t.regex(response.headers.location, /\bfoobar\b/);
  t.regex(response.body.success_description, /\bPost will be created\b/);
  authScope.done();
  hostScope.done();
});

test.serial('Returns 400 if access token does not provide adequate scope', async t => {
  const scope = nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'media'
    });
  const response = await t.context.request
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN_NOSCOPE}`);
  t.is(response.status, 401);
  t.is(response.body.error_description, 'The scope of this token does not meet the requirements for this request');
  t.is(response.body.scope, 'create');
  scope.done();
});
