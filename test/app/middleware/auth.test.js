require('dotenv').config();

const test = require('ava');
const sinon = require('sinon');

const auth = require(process.env.PWD + '/app/middleware/auth');

// Test middleware that checks scope
const mockScopeResponse = providedScope => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  res.locals = {
    indieauthToken: {
      scope: providedScope
    }
  };
  return res;
};

test('Calls next middleware if required scope in access token', t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('create update');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = auth.checkScope('update')(req, res, next);
  t.is(result, 'Go to next');
});

test('Calls next middleware if required scope is `create` and access token provides `post`', t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('post');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = auth.checkScope('create')(req, res, next);
  t.is(result, 'Go to next');
});

test('Calls next middleware if required scope is `post` and access token provides `create`', t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = auth.checkScope('post')(req, res, next);
  t.is(result, 'Go to next');
});

test('Returns 401 if required scope not in access token', async t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('create');
  const next = sinon.spy();

  // Test assertions
  await auth.checkScope('update')(req, res, next);
  t.is(next.args[0][0].message.status, 401);
  t.is(next.args[0][0].message.error, 'Insufficient scope');
});

test('Returns 401 if required scope not provided', async t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('create');
  const next = sinon.spy();

  // Test assertions
  await auth.checkScope(null)(req, res, next);
  t.is(next.args[0][0].message.status, 400);
  t.is(next.args[0][0].message.error, 'Invalid request');
});

// Test middleware that verifies tokens
const client_id = 'https://gimme-a-token.5eb.nl/';
const mockTokenResponse = () => {
  const res = {};
  res.locals = {indieauthToken: {client_id}};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

test.beforeEach(t => {
  t.context.token = process.env.TEST_INDIEAUTH_TOKEN;
});

test('Authenticates using access token in `authorization` header', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${t.context.token}`
    }
  };
  const res = mockTokenResponse();
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = await auth.verifyToken({
    me: 'https://paulrobertlloyd.github.io/indiekit-sandbox/'
  })(req, res, next);
  t.is(result, 'Go to next');
  t.is(res.locals.indieauthToken.client_id, client_id);
});

test('Authenticates using access token in `access_token` body', async t => {
  // Mock Express
  const req = {
    body: {
      access_token: t.context.token
    }
  };
  const res = mockTokenResponse();
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = await auth.verifyToken({
    me: 'https://paulrobertlloyd.github.io/indiekit-sandbox/'
  })(req, res, next);
  t.is(result, 'Go to next');
  t.is(res.locals.indieauthToken.client_id, client_id);
});

test('Returns 400 if publication URL not configured', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${t.context.token}`
    }
  };
  const res = mockTokenResponse();
  const next = sinon.spy();

  // Test assertions
  await auth.verifyToken({me: null})(req, res, next);
  t.is(next.args[0][0].message.status, 400);
  t.is(next.args[0][0].message.error, 'Invalid request');
});

test('Returns 403 if publication URL doesn’t match that in token', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${t.context.token}`
    }
  };
  const res = mockTokenResponse();
  const next = sinon.spy();

  // Test assertions
  await auth.verifyToken({me: 'https://foo.bar'})(req, res, next);
  t.is(next.args[0][0].message.status, 403);
  t.is(next.args[0][0].message.error, 'Access denied');
});
