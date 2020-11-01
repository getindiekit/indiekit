import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

const request = supertest(serverConfig(defaultConfig));

test('Logged out users redirected to login page', async t => {
  const response = await request.get('/');
  t.is(response.statusCode, 302);
});

test('Returns CSS', async t => {
  const response = await request.get('/assets/app.css');
  t.is(response.statusCode, 200);
  t.is(response.type, 'text/css');
});

test('Returns login page', async t => {
  const response = await request.get('/session/login');
  t.is(response.statusCode, 200);
  t.is(response.type, 'text/html');
});

test('Login returns 401 if URL is unauthorized', async t => {
  const response = await request.post('/session/login')
    .send('me=example.website');
  t.is(response.statusCode, 401);
});

test('Auth callback returns 403 if redirect is invalid', async t => {
  const response = await request.get('/session/auth')
    .query('redirect=https://external.example');
  t.is(response.statusCode, 403);
});

test('Logout redirects to homepage', async t => {
  const response = await request.get('/session/logout');
  t.is(response.statusCode, 302);
});
