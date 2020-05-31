import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import * as error from '../../middleware/error.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Returns 404 as HTML', async t => {
  const request = mockRequest({accepts: () => true});
  const response = mockResponse();
  const next = sinon.spy();
  await error.notFound(request, response, next);
  t.true(response.status.calledWith(404));
  t.true(response.render.calledWith('document'));
});

test('Passes error onto next middleware', async t => {
  const request = mockRequest({accepts: () => false});
  const response = mockResponse();
  const next = sinon.spy();
  await error.notFound(request, response, next);
  t.true(next.calledOnce);
});
