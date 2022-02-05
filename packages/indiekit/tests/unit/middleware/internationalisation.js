import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import {internationalisation} from '../../../lib/middleware/internationalisation.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Throws error setting locale', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();

  await internationalisation(false)(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});
