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
    url: 'http://website.example/post/1'
  };
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
  const {job_id, options, timestamp, url} = t.context;
  const captureScope = nock('https://web.archive.org')
    .post('/save/')
    .reply(200, {url, job_id});
  const statusScope = nock('https://web.archive.org')
    .get(`/save/status/${job_id}`)
    .reply(200, {status: 'success', original_url: url, timestamp});
  const syndicator = new InternetArchiveSyndicator(options);
  const result = await syndicator.syndicate({properties: {url}});
  t.is(result.location, `https://web.archive.org/web/20180326070330/${url}`);
  captureScope.done();
  statusScope.done();
});

test('Throws error getting syndicated URL if no API keys provided', async t => {
  const {url} = t.context;
  const syndicator = new InternetArchiveSyndicator({});
  const error = await t.throwsAsync(syndicator.syndicate({properties: {url}}));
  t.is(error.statusCode, 500);
  t.is(error.message, 'Cannot read property \'body\' of undefined');
});

test('Throws error getting syndicated URL if post data not provided', async t => {
  const syndicator = new InternetArchiveSyndicator();
  const error = await t.throwsAsync(syndicator.syndicate());
  t.is(error.message, 'No post data given to syndicate');
});
