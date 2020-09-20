import test from 'ava';
import mockReqRes from 'mock-req-res';
import {shareController} from '../../controllers/share.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Renders share page', t => {
  const request = mockRequest();
  const response = mockResponse({
    __: () => {}
  });
  shareController().get(request, response);
  t.true(response.render.calledWith('share'));
});
