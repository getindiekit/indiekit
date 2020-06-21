import test from 'ava';
import * as sessionController from '../../controllers/session.js';

import mockReqRes from 'mock-req-res';

const {mockRequest, mockResponse} = mockReqRes;

test('Redirects authenticated user to homepage', async t => {
  const request = mockRequest({session: {token: 'token'}});
  const response = mockResponse();
  await sessionController.login(request, response);
  t.true(response.redirect.calledWith('/'));
});
