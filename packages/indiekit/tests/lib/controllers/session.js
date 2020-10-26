import test from 'ava';
import mockReqRes from 'mock-req-res';
import * as sessionController from '../../../lib/controllers/session.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Redirects authenticated user to homepage', async t => {
  const request = mockRequest({session: {token: 'token'}});
  const response = mockResponse();
  await sessionController.login(request, response);
  t.true(response.redirect.calledWith('/'));
});
