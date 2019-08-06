const test = require('ava');
const sinon = require('sinon');

const auth = require(process.env.PWD + '/app/lib/auth');

// Test checkScope
test('Returns true if required scope is provided by token', t => {
  const hasScope = auth.scope.checkScope('update', 'create update');
  t.true(hasScope);
});

test('Returns true if required scope is `create` but token provides `post`', t => {
  const hasScope = auth.scope.checkScope('create', 'post');
  t.true(hasScope);
});

test('Returns true if required scope is `post` but token provides `create`', t => {
  const hasScope = auth.scope.checkScope('post', 'create');
  t.true(hasScope);
});

test('Throws an error if no scope provided in access token', t => {
  const error = t.throws(() => {
    auth.scope.checkScope('delete', undefined);
  });
  t.is(error.message.error_description, 'Access token does not provide any scope(s)');
});

test('Throws an error if required scope not provided', t => {
  const error = t.throws(() => {
    auth.scope.checkScope(undefined, 'create update');
  });
  t.is(error.message.error_description, 'No scope was provided in request');
});

test('Throws an error if required scope not provided by access token', t => {
  const error = t.throws(() => {
    auth.scope.checkScope('delete', 'create update');
  });
  t.is(error.message.error_description, 'Access token does not meet requirements for requested scope (delete)');
});

// Test middleware
const mockResponse = providedScope => {
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
  // Mock express
  const req = null;
  const res = mockResponse('create update');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = auth.scope.middleware('update')(req, res, next);
  t.is(result, 'Go to next');
});

test('Calls next middleware if required scope is `create` and access token provides `post`', t => {
  // Mock express
  const req = null;
  const res = mockResponse('post');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = auth.scope.middleware('create')(req, res, next);
  t.is(result, 'Go to next');
});

test('Calls next middleware if required scope is `post` and access token provides `create`', t => {
  // Mock express
  const req = null;
  const res = mockResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  const result = auth.scope.middleware('post')(req, res, next);
  t.is(result, 'Go to next');
});

test('Returns 401 if required scope not in access token', async t => {
  // Mock express
  const req = null;
  const res = mockResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  await auth.scope.middleware('update')(req, res, next);
  t.true(res.status.calledWith(401));
});

test('Returns 401 if required scope not provided', async t => {
  // Mock express
  const req = null;
  const res = mockResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');

  // Test assertions
  await auth.scope.middleware(null)(req, res, next);
  t.true(res.status.calledWith(401));
});
