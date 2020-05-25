import test from 'ava';
import sinon from 'sinon';
import localDataMiddleware from '../../middleware/local-data.js';

test('Throws error', async t => {
  const request = {
    protocol: 'https',
    headers: {
      host: 'server.example'
    }
  };
  const response = {
    locals: sinon.stub()
  };
  const next = sinon.spy();
  await localDataMiddleware(request, response, next);
  t.true(next.calledOnce);
});
