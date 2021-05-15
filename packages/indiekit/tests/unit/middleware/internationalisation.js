import test from 'ava';
import sinon from 'sinon';
import mockReqRes from 'mock-req-res';
import {defaultConfig} from '../../../config/defaults.js';
import {internationalisation} from '../../../lib/middleware/internationalisation.js';

const {mockRequest, mockResponse} = mockReqRes;

test('Sets locale', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();

  await internationalisation(defaultConfig)(request, response, next);

  t.true(next.calledOnce);
});

test('Sets locale using application setting', async t => {
  const request = mockRequest({session: {token: 'token'}});
  const response = mockResponse({locals: {}});
  const next = sinon.spy();
  defaultConfig.application.locale = 'fr';

  await internationalisation(defaultConfig)(request, response, next);

  t.is(request.getLocale(), 'fr');
});

test('Throws error setting locale', async t => {
  const request = mockRequest();
  const response = mockResponse();
  const next = sinon.spy();

  await internationalisation(false)(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});
