import test from 'ava';
import * as session from '../../controllers/session.js';

import mockReqRes from 'mock-req-res';

const {mockRequest, mockResponse} = mockReqRes;

test('Redirects authenticated user to homepage', async t => {
  const request = mockRequest({session: {token: 'token'}});
  const response = mockResponse();
  await session.login(request, response);
  t.true(response.redirect.calledWith('/'));
});
