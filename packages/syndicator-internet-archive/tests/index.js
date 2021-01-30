import test from 'ava';
import nock from 'nock';
import {InternetArchiveSyndicator} from '../index.js';

test.beforeEach(t => {
  t.context = {
    job_id: 'ac58789b-f3ca-48d0-9ea6-1d1225e98695',
    options: {
      accessKey: '0123456789abcdef',
      secret: 'abcdef0123456789'
    },
    timestamp: '20180326070330',
    properties: {
      url: 'http://website.example/post/1'
    }
  };
});

test('Gets assets path', t => {
  const result = new InternetArchiveSyndicator();

  t.regex(result.assetsPath, /syndicator-internet-archive\/assets/);
});

test('Gets info', t => {
  const result = new InternetArchiveSyndicator();

  t.false(result.info.checked);
  t.is(result.info.name, 'Internet Archive');
  t.is(result.info.uid, 'https://web.archive.org/');
  t.truthy(result.info.service);
});

test('Gets UID', t => {
  const result = new InternetArchiveSyndicator();

  t.is(result.uid, 'https://web.archive.org/');
});

test('Returns syndicated URL', async t => {
  const {job_id, options, timestamp, properties} = t.context;
  nock('https://web.archive.org')
    .post('/save/')
    .reply(200, {url: properties.url, job_id});
  nock('https://web.archive.org')
    .get(`/save/status/${job_id}`)
    .reply(200, {status: 'success', original_url: properties.url, timestamp});
  const syndicator = new InternetArchiveSyndicator(options);

  const result = await syndicator.syndicate(properties);

  t.is(result, `https://web.archive.org/web/20180326070330/${properties.url}`);
});

test('Throws error getting syndicated URL if no API keys provided', async t => {
  const syndicator = new InternetArchiveSyndicator({});

  await t.throwsAsync(syndicator.syndicate({properties: t.context.url}), {
    message: 'Cannot read property \'body\' of undefined'
  });
});
