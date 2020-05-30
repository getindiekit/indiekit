import test from 'ava';
import nock from 'nock';
import {mockClient} from '../helpers/database.js';
import {PublicationModel} from '../../models/publication.js';

const publicationModel = new PublicationModel(mockClient);

test.beforeEach(t => {
  t.context = {
    nock: nock('https://website.example').get('/config.json'),
    url: 'https://website.example/config.json'
  };
});

test.afterEach.always(() => {
  mockClient.flushall();
});

test.serial('Gets a value', async t => {
  await publicationModel.set('defaultConfigType', 'jekyll');
  const result = await publicationModel.get('defaultConfigType');
  t.is(result, 'jekyll');
});

test.serial.failing('Gets merged config', async t => {
  const scope = t.context.nock.reply(200, {foo: 'bar'});
  await publicationModel.set('customConfigUrl', t.context.url);
  const result = await publicationModel.get('customConfig');
  t.log(result);
  scope.done();
});

test.serial('Gets all values', async t => {
  await publicationModel.set('defaultConfigType', 'jekyll');
  const result = await publicationModel.getAll();
  t.is(result.defaultConfigType, 'jekyll');
});

test.serial('Sets a value', async t => {
  await publicationModel.set('defaultConfigType', 'jekyll');
  const result = await publicationModel.get('defaultConfigType');
  t.is(result, 'jekyll');
});

test.serial('Sets all values', async t => {
  await publicationModel.setAll({
    customConfigUrl: t.context.url,
    defaultConfigType: 'jekyll'
  });
  const result = await publicationModel.getAll();
  t.is(result.customConfigUrl, t.context.url);
  t.is(result.defaultConfigType, 'jekyll');
});
