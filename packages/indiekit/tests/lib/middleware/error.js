import HttpError from 'http-errors';
import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import * as error from '../../../lib/middleware/error.js';

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

test('Returns 500 for unknown error', async t => {
  const unknownError = new Error('Unknown');
  const request = mockRequest({accepts: () => false});
  const response = mockResponse();
  const next = sinon.spy();
  await error.internalServer(unknownError, request, response, next);
  t.true(response.status.calledWith(500));
});

test('Renders error as HTML', async t => {
  const httpError = new HttpError(400, 'Error messaage', {
    scope: 'test'
  });
  const request = mockRequest({accepts: mimeType => mimeType.includes('html')});
  const response = mockResponse();
  const next = sinon.spy();
  await error.internalServer(httpError, request, response, next);
  t.true(response.render.calledWith());
});

test('Renders error as JSON', async t => {
  const httpError = new HttpError(400, 'Error messaage', {
    scope: 'test'
  });
  const request = mockRequest({accepts: mimeType => mimeType.includes('json')});
  const response = mockResponse();
  const next = sinon.spy();
  await error.internalServer(httpError, request, response, next);
  t.true(response.json.calledWith());
});

test('Renders error as plain text', async t => {
  const httpError = new HttpError(400, 'Error messaage');
  const request = mockRequest({accepts: () => false});
  const response = mockResponse();
  const next = sinon.spy();
  await error.internalServer(httpError, request, response, next);
  t.true(response.send.calledWith('Error messaage'));
});
