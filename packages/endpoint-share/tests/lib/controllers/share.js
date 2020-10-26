import test from 'ava';
import mockReqRes from 'mock-req-res';
import {shareController} from '../../../lib/controllers/share.js';

const {mockRequest, mockResponse} = mockReqRes;

test.beforeEach(t => {
  t.context.publication = {
    micropubEndpoint: '/micropub'
  };
});

test('Views share page', t => {
  const request = mockRequest();
  const response = mockResponse({
    __: () => {}
  });
  shareController(t.context.publication).get(request, response);
  t.true(response.render.calledWith('share'));
});
