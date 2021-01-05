import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import {postsController} from '../../../lib/controllers/posts.js';

const {mockRequest, mockResponse} = mockReqRes;

test.beforeEach(t => {
  t.context = {
    publication: {
      micropubEndpoint: '/micropub',
      posts: {
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

test('Lists previously published posts', async t => {
  const request = mockRequest();
  const response = mockResponse({
    __: () => {}
  });
  const next = sinon.spy();
  await postsController(t.context.publication).list(request, response, next);
  t.true(response.render.calledWith('posts'));
});

test('Throws error to next middleware if can’t list previously published posts', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await postsController(t.context.publication).list(request, response, next);
  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof TypeError);
});

test('Views previously published post', async t => {
  const request = mockRequest({
    params: {
      id: 1
    }
  });
  const response = mockResponse({
    __: () => {}
  });
  const next = sinon.spy();
  await postsController(t.context.publication).view(request, response, next);
  t.true(response.render.calledWith('post'));
});

test('Returns 404 if can’t find previously uploaded file', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await postsController({
    posts: {findOne: () => false}
  }).view(request, response, next);
  t.true(next.calledOnce);
  t.is(next.firstCall.args[0].message, 'No post was found with this UUID');
});

test('Throws error to next middleware if can’t view previously published post', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await postsController(t.context.publication).view(request, response, next);
  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof TypeError);
});
