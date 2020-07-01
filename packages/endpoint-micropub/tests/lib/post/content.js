import test from 'ava';
import {getPostTypeConfig} from '../../../lib/utils.js';
import {JekyllConfig} from '../../../../config-jekyll/index.js';
import {createPostContent} from '../../../lib/post/content.js';

test.beforeEach(t => {
  const {config} = new JekyllConfig();
  const postTemplateConfig = getPostTypeConfig('note', config);

  t.context = {
    postData: {
      type: 'note',
      path: 'foobar',
      url: 'https://website.example/foobar',
      mf2: {
        type: ['h-entry'],
        properties: {
          content: ['I ate a cheese sandwich, which was nice.'],
          published: ['2020-06-27T17:27:51.170Z'],
          slug: ['foobar'],
          url: ['https://website.example/foobar']
        }
      }
    },
    postTemplatePath: postTemplateConfig.template
  };
});

test('Creates post content', t => {
  const result = createPostContent(t.context.postData, t.context.postTemplatePath);
  t.is(result, '---\ndate: 2020-06-27T17:27:51.170Z\n---\nI ate a cheese sandwich, which was nice.\n');
});

test('Throws error creating post content', t => {
  const error = t.throws(() => createPostContent(t.context.postData, 'foo/bar'));
  t.regex(error.message, /\bno such file or directory\b/);
});
