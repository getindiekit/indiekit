import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import {filesController} from '../../../lib/controllers/files.js';

const {mockRequest, mockResponse} = mockReqRes;

test.beforeEach(t => {
  t.context = {
    publication: {
      mediaEndpoint: '/media',
      media: {
        find: () => ({
          toArray: async () => ([])
        }),
        findOne: async () => ({
          properties: {
            foo: 'bar'
          }
        })
      }
    }
  };
});

test('Lists previously uploaded files', async t => {
  const request = mockRequest();
  const response = mockResponse({
    __: () => {}
  });
  const next = sinon.spy();
  await filesController(t.context.publication).list(request, response, next);
  t.true(response.render.calledWith('files'));
});

test('Throws error to next middleware if can’t list previously uploaded files', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await filesController(t.context.publication).list(request, response, next);
  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof TypeError);
});

test('Views previously uploaded file', async t => {
  const request = mockRequest({
    params: {
      id: 1
    }
  });
  const response = mockResponse({
    __: () => {}
  });
  const next = sinon.spy();
  await filesController(t.context.publication).view(request, response, next);
  t.true(response.render.calledWith('file'));
});

test('Returns 404 if can’t find previously uploaded file', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await filesController({
    media: {findOne: () => false}
  }).view(request, response, next);
  t.true(next.calledOnce);
  t.is(next.firstCall.args[0].message, 'No file was found with this UUID');
});

test('Throws error to next middleware if can’t view previously uploaded file', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await filesController(t.context.publication).view(request, response, next);
  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof TypeError);
});
