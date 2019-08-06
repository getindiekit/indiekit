const nock = require('nock');
const test = require('ava');
const sinon = require('sinon');

const auth = require(process.env.PWD + '/app/lib/auth');
const client_id = 'https://gimme-a-token.5eb.nl/';
const token = process.env.TEST_INDIEAUTH_TOKEN;

// Test verifyToken
test.skip('Returns true if required scope is provided by token', async t => {
  const verifiedToken = await auth.indieauth.verifyToken(token, {
    me: 'https://paulrobertlloyd.github.io/indiekit-sandbox/'
  });
  t.is(verifiedToken.client_id, client_id);
});

test('Throws error if no access token provided', async t => {
  const error = await t.throwsAsync(auth.indieauth.verifyToken(null, {
    me: 'https://paulrobertlloyd.github.io/indiekit-sandbox/'
  }));
  t.is(error.message.error_description, 'No access token provided in request');
});

test('Throws error if no publication URL provided', async t => {
  const error = await t.throwsAsync(auth.indieauth.verifyToken(token, {
    me: null
  }));
  t.is(error.message.error_description, 'Publication URL not configured');
});

test('Throws error if publication URL not authenticated by token', async t => {
  // Mock request
  const scope = nock('https://tokens.indieauth.com/token')
    .get('')
    .reply(200, {
      me: 'https://paulrobertlloyd.github.io/indiekit-sandbox/'
    });

  // Test assertions
  const error = await t.throwsAsync(auth.indieauth.verifyToken(token, {
    me: 'https://foo.bar'
  }));
  t.is(error.message.error_description, 'User does not have permission to perform request');

  scope.done();
});

test('Throws error if token endpoint returns an error', async t => {
  // Mock request
  const scope = nock('https://tokens.indieauth.com/token')
    .get('')
    .reply(404, {
      error: 'invalid_request',
      error_description: 'The code provided was not valid'
    });

  // Test assertions
  const error = await t.throwsAsync(auth.indieauth.verifyToken(token, {
    me: 'https://paulrobertlloyd.github.io/indiekit-sandbox/'
  }));
  t.is(error.message.error_description, 'The code provided was not valid');

  scope.done();
});

// Test middleware
const mockResponse = () => {
  const res = {};
  res.locals = {indieauthToken: {client_id}};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

test.skip('Authenticates using token in `access_token` body', async t => {
  // Mock Express
  const req = {
    body: {
      access_token: token
    }
  };
  const res = mockResponse();

  // Test assertions
  await auth.indieauth.middleware(req, res, () => {});
  t.deepEqual(res.locals.indieauthToken, {client_id});
});

test.skip('Authenticates using token in `authorization` header', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockResponse();

  // Test assertions
  await auth.indieauth.middleware(req, res, () => {});
  t.deepEqual(res.locals.indieauthToken, {client_id});
});

test.skip('Returns 400 if publication URL not configured', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockResponse();

  // Test assertions
  await auth.indieauth.middleware({me: null})(req, res, () => {});
  t.true(res.status.calledWith(400));
});

test.skip('Returns 403 if publication URL doesn’t match that in token', async t => {
  // Mock Express
  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const res = mockResponse();

  // Test assertions
  await auth.indieauth.middleware({me: 'https://foo.bar'})(req, res, () => {});
  t.true(res.status.calledWith(403));
});
