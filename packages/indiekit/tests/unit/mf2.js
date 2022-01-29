import test from 'ava';
import nock from 'nock';
import {getFixture} from '@indiekit-test/get-fixture';
import {url2Mf2} from '../../lib/mf2.js';

test.beforeEach(t => {
  t.context = {
    url: 'https://website.example/home.html',
  };
});

test('Returns mf2 from URL', async t => {
  nock('https://website.example')
    .get('/home.html')
    .reply(200, getFixture('html/home.html'));

  t.deepEqual(await url2Mf2(t.context.url), {
    'rel-urls': {
      'https://indieauth.com/auth': {
        rels: ['authorization_endpoint'],
        text: '',
      },
      'https://tokens.indieauth.com/token': {
        rels: ['token_endpoint'],
        text: '',
      },
      'https://website.example': {
        rels: ['me'],
        text: 'Jane Doe',
      },
    },
    rels: {
      authorization_endpoint: ['https://indieauth.com/auth'],
      token_endpoint: ['https://tokens.indieauth.com/token'],
      me: ['https://website.example'],
    },
    items: [{
      type: ['h-card'],
      properties: {
        name: ['Jane Doe'],
        url: ['https://website.example'],
      },
    }],
  });
});

test('Returns mf2 empty objects if no properties found', async t => {
  nock('https://website.example')
    .get('/home.html')
    .reply(200, getFixture('html/page.html'));

  t.deepEqual(await url2Mf2(t.context.url), {
    rels: {},
    'rel-urls': {},
    items: [],
  });
});

test('Throws error if URL not found', async t => {
  nock('https://website.example')
    .get('/home.html')
    .replyWithError('Not found');

  await t.throwsAsync(url2Mf2(t.context.url), {
    message: 'Not found',
  });
});
