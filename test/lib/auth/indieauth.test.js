const test = require('ava');
const sinon = require('sinon');

// Function
const auth = require(process.env.PWD + '/app/lib/auth');
const token = process.env.TEST_INDIEAUTH_TOKEN;
const client_id = 'https://gimme-a-token.5eb.nl/';
const mockResponse = () => {
  const res = {};
  res.locals = {indieauthToken: {client_id}};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

// Tests
test('Authenticates using token in `access_token` body', async t => {
  const req = {
    body: {
      access_token: token
    }
  };
  const res = mockResponse();
  await auth.indieauth(req, res, () => {});
  t.deepEqual(res.locals.indieauthToken, {client_id});
});

test('Authenticates using token in `authorization` header', async t => {
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockResponse();
  await auth.indieauth(req, res, () => {});
  t.deepEqual(res.locals.indieauthToken, {client_id});
});

test('Returns 400 if publication URL not configured', async t => {
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockResponse();
  await auth.indieauth({me: null})(req, res, () => {});
  t.true(res.status.calledWith(400));
});

test('Returns 403 if publication URL doesn’t match that in token', async t => {
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockResponse();
  await auth.indieauth({me: 'https://foo.bar'})(req, res, () => {});
  t.true(res.status.calledWith(403));
});
