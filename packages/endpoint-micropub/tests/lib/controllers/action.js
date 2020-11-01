import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import test from 'ava';
import nock from 'nock';
import supertest from 'supertest';
import {serverConfig} from '../../../../indiekit/config/server.js';
import {Indiekit} from '../../../../indiekit/index.js';
import {GithubStore} from '../../../../store-github/index.js';
import {JekyllPreset} from '../../../../preset-jekyll/index.js';

test.beforeEach(async t => {
  const github = new GithubStore({
    token: 'abc123',
    user: 'user',
    repo: 'repo'
  });
  const jekyll = new JekyllPreset();
  const indiekit = new Indiekit();
  indiekit.set('publication.me', process.env.TEST_PUBLICATION_URL);
  indiekit.set('publication.preset', jekyll);
  indiekit.set('publication.store', github);
  const config = await indiekit.init();
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
  t.is(response.statusCode, 202);
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
  t.is(response.statusCode, 401);
  t.is(response.body.error_description, 'The scope of this token does not meet the requirements for this request');
  t.is(response.body.scope, 'create');
  scope.done();
});
