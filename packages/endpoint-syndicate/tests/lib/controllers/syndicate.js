import test from 'ava';
import mockReqRes from 'mock-req-res';
import {syndicateController} from '../../../lib/controllers/syndicate.js';

import {publication as postsSyndicated} from '../../fixtures/posts-syndicated.js';
import {publication as postsNoTargets} from '../../fixtures/posts-no-targets.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Returns message if no syndication targets', async t => {
  const request = mockRequest({query: {url: 'https://example.website/no-post'}});
  const response = mockResponse();
  await syndicateController(postsNoTargets).post(request, response);
  t.true(response.json.calledWithMatch({success_description: 'No syndication targets have been configured'}));
});

test('Returns message if post not awaiting syndication', async t => {
  const request = mockRequest({query: {url: 'https://example.website/syndicated-post'}});
  const response = mockResponse();
  await syndicateController(postsSyndicated).post(request, response);
  t.true(response.json.calledWithMatch({success_description: 'No posts awaiting syndication'}));
});
