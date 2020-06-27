import test from 'ava';
import {getFixture} from '../../helpers/fixture.js';
import {JekyllConfig} from '../../../../config-jekyll/index.js';
import {
  createMediaData,
  readMediaData
} from '../../../lib/media/data.js';

test('Creates media data', async t => {
  const file = {
    buffer: getFixture('photo.jpg', false),
    originalname: 'photo.jpg'
  };
  const publication = {
    config: new JekyllConfig().config,
    me: 'https://website.example'
  };
  const result = await createMediaData(file, publication);
  t.is(result.type, 'photo');
  t.regex(result.path, /\b[\d\w]{5}\b/g);
  t.truthy(result.file.properties);
});

test('Throws error creates media data without a file', async t => {
  const file = {
    buffer: getFixture('font.ttf', false),
    originalname: 'font.ttf'
  };
  const publication = {
    config: new JekyllConfig().config,
    me: 'https://website.example'
  };
  const error = await t.throwsAsync(
    createMediaData(file, publication)
  );
  t.is(error.message, 'Cannot read property \'media\' of undefined');
});

test('Throws error creates media data without a known post type', async t => {
  const publication = {
    config: new JekyllConfig().config,
    me: 'https://website.example'
  };
  const error = await t.throwsAsync(
    createMediaData(false, publication)
  );
  t.is(error.message, 'No file included in request');
});

test('Reads media data', async t => {
  const url = 'https://website.example/photo.jpg';
  const publication = {
    media: {
      get: async key => ({
        type: 'photo',
        path: 'photo.jpg',
        url: key,
        file: {
          properties: {}
        }
      })
    }
  };
  const result = await readMediaData(url, publication);
  t.is(result.type, 'photo');
});

test('Throws error reading media without logged URL', async t => {
  const url = 'https://website.example/photo.jpg';
  const publication = {
    media: {
      get: async key => {
        throw new Error(`No value found for ${key}`);
      }
    }
  };
  const error = await t.throwsAsync(
    readMediaData(url, publication)
  );
  t.is(error.message, `No value found for ${url}`);
});
