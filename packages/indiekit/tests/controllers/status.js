import test from 'ava';
import mockReqRes from 'mock-req-res';
import * as statusController from '../../controllers/status.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Renders status page', async t => {
  const request = mockRequest();
  const response = mockResponse({
    __: () => {}
  });
  await statusController.viewStatus(request, response);
  t.true(response.render.calledWith('status'));
});
