import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import {authenticate} from '../../middleware/authentication.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Redirects to login page', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await authenticate(request, response, next);
  t.true(response.redirect.calledWith(`/session/login?redirect=${request.originalUrl}`));
});

test('Continues to next middleware', async t => {
  const request = mockRequest({session: {token: 'token'}});
  const response = mockResponse();
  const next = sinon.spy();
  await authenticate(request, response, next);
  t.true(next.calledOnce);
});
