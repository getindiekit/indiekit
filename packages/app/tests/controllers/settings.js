import test from 'ava';
import * as settings from '../../controllers/settings.js';

import mockReqRes from 'mock-req-res';

const {mockRequest, mockResponse} = mockReqRes;
const request = mockRequest({params: {hostId: 'github'}});
const response = mockResponse();

test('Views all settings', async t => {
  await settings.viewAll(request, response);
  t.true(response.render.calledWith('settings/index'));
});

test('Edits application settings', async t => {
  await settings.editApplication(request, response);
  t.true(response.render.calledWith('settings/application'));
});

test('Edits puplication settings', async t => {
  await settings.editPublication(request, response);
  t.true(response.render.calledWith('settings/publication'));
});

test('Edits content host settings', async t => {
  await settings.editHost(request, response);
  t.true(response.render.calledWith('settings/github'));
});
