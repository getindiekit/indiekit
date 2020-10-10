import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import {syndicateController} from '../../../lib/controllers/syndicate.js';

import {publication as postsEmpty} from '../../fixtures/posts-empty.js';
import {publication as postsNotSyndicated} from '../../fixtures/posts-not-syndicated.js';
import {publication as postsSyndicated} from '../../fixtures/posts-syndicated.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Throws error if post not awaiting syndication', async t => {
  const request = mockRequest({query: {url: 'https://example.website/syndicated-post'}});
  const response = mockResponse();
  const next = sinon.spy();
  await syndicateController(postsSyndicated).get(request, response, next);
  t.is(next.firstCall.args[0].message, 'No posts awaiting syndication');
});

test('Throws error if no post record available for URL', async t => {
  const request = mockRequest({query: {url: 'https://example.website/no-post'}});
  const response = mockResponse();
  const next = sinon.spy();
  await syndicateController(postsNotSyndicated).get(request, response, next);
  t.is(next.firstCall.args[0].message, 'No post record available for https://example.website/no-post');
});

test('Throws error if no post records available', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();
  await syndicateController(postsEmpty).get(request, response, next);
  t.is(next.firstCall.args[0].message, 'No post records available');
});
