import test from 'ava';
import mockReqRes from 'mock-req-res';
import {syndicateController} from '../../../lib/controllers/syndicate.js';

import {publication as postsEmpty} from '../../fixtures/posts-empty.js';
import {publication as postsNotSyndicated} from '../../fixtures/posts-not-syndicated.js';
import {publication as postsSyndicated} from '../../fixtures/posts-syndicated.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Returns message if post not awaiting syndication', async t => {
  const request = mockRequest({query: {url: 'https://example.website/syndicated-post'}});
  const response = mockResponse();
  await syndicateController(postsSyndicated).post(request, response);
  t.true(response.json.calledWithMatch({success_description: 'No posts awaiting syndication'}));
});

test('Returns message if no post record available for URL', async t => {
  const request = mockRequest({query: {url: 'https://example.website/no-post'}});
  const response = mockResponse();
  await syndicateController(postsNotSyndicated).post(request, response);
  t.true(response.json.calledWithMatch({success_description: 'No post record available for https://example.website/no-post'}));
});

test('Returns 200 if no post records available', async t => {
  const request = mockRequest();
  const response = mockResponse();
  await syndicateController(postsEmpty).post(request, response);
  t.true(response.json.calledWithMatch({success_description: 'No post records available'}));
});
