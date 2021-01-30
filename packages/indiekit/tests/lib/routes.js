import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

const request = supertest(serverConfig(defaultConfig));

test('Returns robot.txt', async t => {
  const result = await request.get('/robots.txt');

  t.is(result.statusCode, 200);
  t.is(result.text, 'User-agent: *\nDisallow: /');
  t.is(result.type, 'text/plain');
});

test('Logged out users redirected to login page', async t => {
  const result = await request.get('/');

  t.is(result.statusCode, 302);
});

test('Returns CSS', async t => {
  const result = await request.get('/assets/app.css');

  t.is(result.statusCode, 200);
  t.is(result.type, 'text/css');
});

test('Returns login page', async t => {
  const result = await request.get('/session/login');

  t.is(result.headers['x-robots-tag'], 'noindex');
  t.is(result.statusCode, 200);
  t.is(result.type, 'text/html');
});

test('Login returns 401 if URL is unauthorized', async t => {
  const result = await request.post('/session/login')
    .send('me=example.website');

  t.is(result.statusCode, 401);
});

test('Auth callback returns 403 if redirect is invalid', async t => {
  const result = await request.get('/session/auth')
    .query('redirect=https://external.example');

  t.is(result.statusCode, 403);
});

test('Logout redirects to homepage', async t => {
  const result = await request.get('/session/logout');

  t.is(result.statusCode, 302);
});
