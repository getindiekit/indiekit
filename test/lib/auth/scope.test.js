const test = require('ava');
const sinon = require('sinon');

// Function
const auth = require(process.env.PWD + '/app/lib/auth');
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

// Tests
test('Continues to next middleware if required scope in access token', t => {
  const req = null;
  const res = mockResponse('create update');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');
  const result = auth.scope('update')(req, res, next);
  t.is(result, 'Go to next');
});

test('Continues to next middleware if required scope is `create` and access token provides `post`', t => {
  const req = null;
  const res = mockResponse('post');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');
  const result = auth.scope('create')(req, res, next);
  t.is(result, 'Go to next');
});

test('Continues to next middleware if required scope is `post` and access token provides `create`', t => {
  const req = null;
  const res = mockResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');
  const result = auth.scope('post')(req, res, next);
  t.is(result, 'Go to next');
});

test('Returns 401 if required scope not in access token', async t => {
  const req = null;
  const res = mockResponse('create');
  const next = sinon.mock().once().withExactArgs().returns('Go to next');
  await auth.scope('update')(req, res, next);
  t.true(res.status.calledWith(401));
});
