import test from 'ava';
import sinon from 'sinon';
import {locals} from '../../middleware/locals.js';

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
  await locals(request, response, next);
  t.true(next.calledOnce);
});
