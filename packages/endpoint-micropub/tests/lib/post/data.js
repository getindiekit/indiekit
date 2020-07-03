import test from 'ava';
import {JekyllConfig} from '../../../../config-jekyll/index.js';
import {postData} from '../../../lib/post/data.js';

test('Creates post data', t => {
  const mf2 = {
    type: 'h-entry',
    properties: {
      name: ['foo']
    }
  };
  const publication = {
    config: new JekyllConfig().config,
    me: 'https://website.example'
  };
  const result = postData.create(publication, mf2);
  t.is(result.type, 'note');
  t.truthy(result.mf2.properties.published[0]);
  t.is(result.mf2.properties.slug[0], 'foo');
  t.truthy(result.mf2.properties);
});

test('Throws error creating post data without source microformats', t => {
  const publication = {
    config: new JekyllConfig().config,
    me: 'https://website.example'
  };
  const error = t.throws(() => postData.create(publication, false));
  t.regex(error.message, /\bCannot destructure property\b/);
});

test('Reads post data', async t => {
  const url = 'https://website.example/foo';
  const publication = {
    posts: {
      get: async key => ({
        type: 'note',
        path: 'foo',
        url: key,
        mf2: {
          properties: {}
        }
      })
    }
  };
  const result = await postData.read(publication, url);
  t.is(result.type, 'note');
});

test('Throws error reading media without logged URL', async t => {
  const url = 'https://website.example/foo';
  const publication = {
    posts: {
      get: async key => {
        throw new Error(`No value found for ${key}`);
      }
    }
  };
  const error = await t.throwsAsync(
    postData.read(publication, url)
  );
  t.is(error.message, `No value found for ${url}`);
});

test('Updates post data', async t => {
  const url = 'https://website.example/foo';
  const publication = {
    config: new JekyllConfig().config,
    me: 'https://website.example',
    posts: {
      get: async key => ({
        type: 'note',
        path: 'foo',
        url: key,
        mf2: {
          properties: {
            name: ['foo']
          }
        }
      })
    }
  };
  const operation = {
    add: {
      syndication: ['http://website.example']
    }
  };
  const result = await postData.update(publication, url, operation);
  t.log(result);
  t.truthy(result.mf2.properties.syndication);
});
