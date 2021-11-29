import test from 'ava';
import {getFixture} from '@indiekit-test/get-fixture';
import {JekyllPreset} from '../../../preset-jekyll/index.js';
import {mediaData} from '../../lib/media-data.js';

test.beforeEach(t => {
  t.context = {
    file: {
      buffer: getFixture('file-types/photo.jpg', false),
      originalname: 'photo.jpg',
    },
    publication: {
      me: 'https://website.example',
      postTypes: new JekyllPreset().postTypes,
      media: {
        findOne: async url => {
          if (url['properties.url'] === 'https://website.example/photo.jpg') {
            return {
              path: 'photo.jpg',
              properties: {
                'post-type': 'photo',
                url,
              },
            };
          }
        },
      },
    },
    url: 'https://website.example/photo.jpg',
  };
});

test('Creates media data', async t => {
  const result = await mediaData.create(t.context.publication, t.context.file);

  t.regex(result.path, /\b[\d\w]{5}\b/g);
  t.is(result.properties['post-type'], 'photo');
});

test('Throws error creating media data without publication configuration', async t => {
  await t.throwsAsync(mediaData.create(false, t.context.file), {
    message: 'No publication configuration provided',
  });
});

test('Throws error creating media data without a known post type', async t => {
  const file = {
    buffer: getFixture('file-types/font.ttf', false),
    originalname: 'font.ttf',
  };

  await t.throwsAsync(mediaData.create(t.context.publication, file), {
    message: 'Cannot read properties of undefined (reading \'media\')',
  });
});

test('Throws error creating media data without a file', async t => {
  await t.throwsAsync(mediaData.create(t.context.publication, false), {
    message: 'No file included in request',
  });
});

test('Reads media data', async t => {
  const result = await mediaData.read(t.context.publication, t.context.url);

  t.is(result.properties['post-type'], 'photo');
});

test('Throws error reading media data without publication configuration', async t => {
  await t.throwsAsync(mediaData.read(false, t.context.url), {
    message: 'No publication configuration provided',
  });
});

test('Throws error reading media data without URL', async t => {
  await t.throwsAsync(mediaData.read(t.context.publication, false), {
    message: 'No URL provided',
  });
});
