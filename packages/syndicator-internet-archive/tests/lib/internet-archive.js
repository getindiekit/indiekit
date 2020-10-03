import test from 'ava';
import nock from 'nock';
import {internetArchive} from '../../lib/internet-archive.js';

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

test('Makes capture request', async t => {
  const {job_id, options, url} = t.context;
  const scope = nock('https://web.archive.org')
    .post('/save/')
    .reply(200, {url, job_id});
  const result = await internetArchive(options).capture(url);
  t.deepEqual(result, {job_id, url});
  scope.done();
});

test('Throws error making capture request', async t => {
  const {url} = t.context;
  const scope = nock('https://web.archive.org')
    .post('/save/')
    .reply(401, {message: 'You need to be logged in to use Save Page Now.'});
  const error = await t.throwsAsync(internetArchive({}).capture(url));
  t.is(error.message, 'You need to be logged in to use Save Page Now.');
  scope.done();
});

test('Makes status request', async t => {
  const {job_id, options, timestamp, url} = t.context;
  const pendingScope = nock('https://web.archive.org')
    .get(`/save/status/${job_id}`)
    .reply(200, {status: 'pending'});
  const successScope = nock('https://web.archive.org')
    .get(`/save/status/${job_id}`)
    .reply(200, {status: 'success', original_url: url, timestamp});
  const result = await internetArchive(options).status(job_id);
  t.deepEqual(result, {status: 'success', original_url: url, timestamp});
  pendingScope.done();
  successScope.done();
});

test('Throws error message from status request', async t => {
  const {job_id, options, url} = t.context;
  const scope = nock('https://web.archive.org')
    .get(`/save/status/${job_id}-1`)
    .reply(200, {status: 'error', message: `Couldn't resolve host for ${url}`});
  const error = await t.throwsAsync(internetArchive(options).status(`${job_id}-1`));
  t.is(error.message, `Couldn't resolve host for ${url}`);
  scope.done();
});

test('Throws error making status request', async t => {
  const {job_id} = t.context;
  const scope = nock('https://web.archive.org')
    .get(`/save/status/${job_id}-2`)
    .reply(401, 'You need to be logged in to use Save Page Now.');
  const error = await t.throwsAsync(internetArchive({}).status(`${job_id}-2`));
  t.is(error.message, 'You need to be logged in to use Save Page Now.');
  scope.done();
});
