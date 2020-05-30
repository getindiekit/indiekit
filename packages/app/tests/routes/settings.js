import test from 'ava';
import nock from 'nock';
import supertest from 'supertest';

import app from '../../index.js';
import {client} from '../../config/database.js';

const request = supertest(app);

test.afterEach(() => {
  client.flushall();
});

test('Gets all settings', async t => {
  const response = await request.get('/settings');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Gets application settings', async t => {
  const response = await request.get('/settings/application');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Posts application settings', async t => {
  const response = await request.post('/settings/application')
    .send('foo=bar');
  t.is(response.status, 302);
});

test('Gets publication settings', async t => {
  const response = await request.get('/settings/publication');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Posts publication settings and validates values', async t => {
  const response = await request.post('/settings/publication')
    .send('customConfigUrl=foobar');
  t.is(response.status, 422);
});

test('Posts publication settings and redirects to overview', async t => {
  const scope = nock('https://website.example')
    .get('/config.json')
    .reply(200);
  const response = await request.post('/settings/publication')
    .send('defaultConfigType=jekyll')
    .send('customConfigUrl=https://website.example/config.json');
  t.is(response.status, 302);
  scope.done();
});

test('Gets GitHub settings', async t => {
  const response = await request.get('/settings/github');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Posts GitHub settings and validates values', async t => {
  const response = await request.post('/settings/github')
    .send('token=foobar');
  t.is(response.status, 422);
});

test('Posts GitHub settings and redirects to overview', async t => {
  const response = await request.post('/settings/github')
    .send('user=user')
    .send('repo=repo')
    .send('token=abcdef0123456789abcdef0123456789abcdef01');
  t.is(response.status, 302);
});

test('Gets GitLab settings', async t => {
  const response = await request.get('/settings/gitlab');
  t.is(response.status, 200);
  t.is(response.type, 'text/html');
});

test('Posts GitLab settings and validates values', async t => {
  const response = await request.post('/settings/gitlab')
    .send('token=foobar');
  t.is(response.status, 422);
});

test('Posts GitLab settings and redirects to overview', async t => {
  const response = await request.post('/settings/gitlab')
    .send('instance=http://gitlab.com')
    .send('user=user')
    .send('repo=repo')
    .send('token=abcdefghijklmnopqrst');
  t.is(response.status, 302);
});
