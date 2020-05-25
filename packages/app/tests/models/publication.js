import test from 'ava';
import nock from 'nock';
import {rewiremock} from '../helpers/rewiremock.js';
import {client} from '../../config/database.js';

test.beforeEach(async t => {
  t.context = {
    publicationModel: await rewiremock.proxy(() => {
      return import('../../models/publication.js');
    }),
    nock: nock('https://website.example').get('/config.json'),
    url: 'https://website.example/config.json'
  };
});

test.afterEach.always(() => {
  client.flushall();
});

test.serial('Gets a value', async t => {
  await t.context.publicationModel.set('defaultConfigType', 'jekyll');
  const result = await t.context.publicationModel.get('defaultConfigType');
  t.is(result, 'jekyll');
});

test.serial('Gets all values', async t => {
  await t.context.publicationModel.set('defaultConfigType', 'jekyll');
  const result = await t.context.publicationModel.getAll();
  t.is(result.defaultConfigType, 'jekyll');
});

test.serial('Sets a value', async t => {
  await t.context.publicationModel.set('defaultConfigType', 'jekyll');
  const result = await t.context.publicationModel.get('defaultConfigType');
  t.is(result, 'jekyll');
});

test.serial('Sets all values', async t => {
  const scope = t.context.nock.reply(200, {});
  await t.context.publicationModel.setAll({
    customConfigUrl: t.context.url,
    defaultConfigType: 'jekyll'
  });
  const result = await t.context.publicationModel.getAll();
  t.is(result.customConfigUrl, t.context.url);
  t.is(result.defaultConfigType, 'jekyll');
  scope.done();
});
