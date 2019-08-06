const test = require('ava');
const sinon = require('sinon');

const indieauth = require(process.env.PWD + '/app/lib/indieauth');

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
  const result = indieauth.checkScope('update')(req, res, next);
  t.is(result, 'Go to next');
});

test('Calls next middleware if required scope is `create` and access token provides `post`', t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('post');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = indieauth.checkScope('create')(req, res, next);
  t.is(result, 'Go to next');
});

test('Calls next middleware if required scope is `post` and access token provides `create`', t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = indieauth.checkScope('post')(req, res, next);
  t.is(result, 'Go to next');
});

test('Returns 401 if required scope not in access token', async t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  await indieauth.checkScope('update')(req, res, next);
  t.true(res.status.calledWith(401));
});

test('Returns 401 if required scope not provided', async t => {
  // Mock Express
  const req = null;
  const res = mockScopeResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  await indieauth.checkScope(null)(req, res, next);
  t.true(res.status.calledWith(401));
});

// Test middleware that verifies tokens
const client_id = 'https://gimme-a-token.5eb.nl/';
const token = process.env.TEST_INDIEAUTH_TOKEN;
const mockTokenResponse = () => {
  const res = {};
  res.locals = {indieauthToken: {client_id}};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

test('Authenticates using token in `access_token` body', async t => {
  // Mock Express
  const req = {
    body: {
      access_token: token
    }
  };
  const res = mockTokenResponse();

  // Test assertions
  await indieauth.verifyToken(req, res, () => {});
  t.deepEqual(res.locals.indieauthToken, {client_id});
});

test('Authenticates using token in `authorization` header', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockTokenResponse();

  // Test assertions
  await indieauth.verifyToken(req, res, () => {});
  t.deepEqual(res.locals.indieauthToken, {client_id});
});

test('Returns 400 if publication URL not configured', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockTokenResponse();

  // Test assertions
  await indieauth.verifyToken({me: null})(req, res, () => {});
  t.true(res.status.calledWith(400));
});

test.skip('Returns 403 if publication URL doesn’t match that in token', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockTokenResponse();

  // Test assertions
  await indieauth.verifyToken({me: 'https://foo.bar'})(req, res, () => {});
  t.true(res.status.calledWith(403));
});
