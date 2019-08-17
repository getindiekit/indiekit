require('dotenv').config();

const nock = require('nock');
const sinon = require('sinon');
const test = require('ava');

const locals = require(process.env.PWD + '/app/middleware/locals');

const mockScopeRequest = () => {
  const req = {};
  req.headers = {
    host: 'localhost'
  };
  req.protocol = 'http';
  req.app = {
    locals: {
      app: null,
      pub: null
    }
  };
  return req;
};

const mockScopeResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  res.locals = sinon.stub().returns(res);
  return res;
};

test.serial('Application saves publication config to locals', async t => {
  // Mock GitHub request
  let content = {
    categories: ['foo', 'bar']
  };
  content = JSON.stringify(content);
  content = Buffer.from(content).toString('base64');

  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('foo.json'))
    .reply(200, {
      content
    });

  // Mock Express
  const req = mockScopeRequest();
  const res = mockScopeResponse();
  const next = sinon.spy();

  // Test assertions
  const config = {
    pub: {
      config: 'foo.json'
    }
  };
  await locals(config)(req, res, next);
  t.deepEqual(req.app.locals.pub.categories, ['foo', 'bar']);
  scope.done();
});

test.serial('Application throws error if remote publication config can’t be fetched', async t => {
  // Mock GitHub request
  const scope = nock('https://api.github.com')
    .get(uri => uri.includes('bar.json'))
    .replyWithError('not found');

  // Mock Express
  const req = mockScopeRequest();
  const res = mockScopeResponse();
  const next = sinon.spy();

  // Test assertions
  const config = {
    pub: {
      config: 'bar.json'
    }
  };
  await locals(config)(req, res, next);
  t.is(next.args[0][0].message.error_description, 'bar.json could not be found in the cache or at the specified remote location');
  scope.done();
});
