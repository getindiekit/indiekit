import test from 'ava';
import mockReqRes from 'mock-req-res';
import * as homepageController from '../../controllers/homepage.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Redirects unauthenticated user to login page', async t => {
  const request = mockRequest({session: {}});
  const response = mockResponse();
  await homepageController.viewHomepage(request, response);
  t.true(response.redirect.calledWith('/session/login'));
});

test('Redirects authenticated user to status page', async t => {
  const request = mockRequest({session: {token: 'token'}});
  const response = mockResponse();
  await homepageController.viewHomepage(request, response);
  t.true(response.redirect.calledWith('/status'));
});
