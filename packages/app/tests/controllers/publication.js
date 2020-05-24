import test from 'ava';
import nock from 'nock';
import {rewiremock} from '../helpers/rewiremock.js';
import {client} from '../../config/database.js';
import * as publicationController from '../../controllers/publication.js';

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

test('Reads a publication setting', async t => {
  const result = await publicationController.read();
  t.is(result.defaultConfigType, 'jekyll');
});

test.serial('Throws error if can’t get default config ', async t => {
  await t.context.publicationModel.set('defaultConfigType', 'foobar');
  const error = await t.throwsAsync(publicationController.read());
  t.regex(error.message, /\bCannot find package\b/);
});

test.serial('Throws error if can’t get custom config ', async t => {
  const scope = t.context.nock.replyWithError('not found');
  await t.context.publicationModel.set('customConfigUrl', t.context.url);
  const error = await t.throwsAsync(publicationController.read());
  t.regex(error.message, /\bnot found\b/);
  scope.done();
});

test('Writes an application setting', async t => {
  const result = await publicationController.write({key6: 'foobar'});
  t.is(result, true);
});

test('Throws error writing setting with no values', async t => {
  const error = await t.throwsAsync(publicationController.write());
  t.regex(error.message, /\bwrong number of arguments\b/);
});
