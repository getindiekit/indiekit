import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import test from 'ava';
import nock from 'nock';
import supertest from 'supertest';
import {posts} from './fixtures/posts.js';
import {serverConfig} from '../../indiekit/config/server.js';
import {Indiekit} from '../../indiekit/index.js';
import {GithubStore} from '../../store-github/index.js';
import {JekyllPreset} from '../../preset-jekyll/index.js';

test.beforeEach(async t => {
  const github = new GithubStore({
    token: 'abc123',
    user: 'user',
    repo: 'repo'
  });
  const jekyll = new JekyllPreset();
  const indiekit = new Indiekit();
  indiekit.set('application.hasDatabase', true);
  indiekit.set('publication.me', process.env.TEST_PUBLICATION_URL);
  indiekit.set('publication.posts', posts);
  indiekit.set('publication.preset', jekyll);
  indiekit.set('publication.store', github);
  indiekit.set('publication.syndicationTargets', [{
    uid: 'https://social.example/',
    name: 'Example social media website',
    syndicate: () => ({
      location: 'https://social.example/status/12345'
    })
  }]);
  const config = await indiekit.init();
  const request = supertest(serverConfig(config));

  t.context.request = request.post('/syndicate')
    .set('Accept', 'application/json');
});

test('Syndicates a URL', async t => {
  const authScope = nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'update'
    });
  const storeScope = nock('https://api.github.com')
    .put(uri => uri.includes('12345'))
    .reply(200, {commit: {message: 'Message'}});
  const response = await t.context.request
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`)
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/2020/10/17/12345`);
  t.is(response.statusCode, 200);
  t.is(response.body.success_description, `Post updated at ${process.env.TEST_PUBLICATION_URL}notes/2020/10/17/12345`);
  authScope.done();
  storeScope.done();
});

test('Throws error syndicating a URL', async t => {
  const authScope = nock('https://tokens.indieauth.com')
    .get('/token')
    .reply(200, {
      me: process.env.TEST_PUBLICATION_URL,
      scope: 'update'
    });
  const storeScope = nock('https://api.github.com')
    .put(uri => uri.includes('12345'))
    .replyWithError('User does not have permission to perform request');
  const response = await t.context.request
    .set('Authorization', `Bearer ${process.env.TEST_BEARER_TOKEN}`)
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/2020/10/17/12345`);
  t.is(response.statusCode, 500);
  t.regex(response.body.error_description, /User does not have permission to perform request/);
  authScope.done();
  storeScope.done();
});
