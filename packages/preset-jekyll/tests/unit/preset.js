import test from 'ava';
import {getFixture} from '@indiekit-test/get-fixture';
import {JekyllPreset} from '../../index.js';

const jekyll = new JekyllPreset();

test.beforeEach(t => {
  t.context.properties = JSON.parse(getFixture('jf2/all-properties.jf2'));
});

test('Gets publication post types', t => {
  const result = jekyll.postTypes;

  t.is(result[0].type, 'article');
});

test('Renders post template without content', t => {
  const result = jekyll.postTemplate({
    published: '2020-02-02',
    name: 'Lunchtime'
  });

  t.is(result, `---
date: 2020-02-02
title: Lunchtime
---
`);
});

test('Renders post template with basic content', t => {
  const result = jekyll.postTemplate({
    published: '2020-02-02',
    name: 'Lunchtime',
    content: 'I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.'
  });

  t.is(result, `---
date: 2020-02-02
title: Lunchtime
---
I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`);
});

test('Renders post template with HTML content', t => {
  const result = jekyll.postTemplate({
    published: '2020-02-02',
    name: 'Lunchtime',
    content: {
      html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>'
    }
  });

  t.is(result, `---
date: 2020-02-02
title: Lunchtime
---
<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>
`);
});

test('Renders post template', t => {
  const jekyll = new JekyllPreset({frontmatterFormat: 'yaml'});

  const result = jekyll.postTemplate(t.context.properties);

  t.is(result, `---
date: 2020-02-02
title: What I had for lunch
excerpt: A very satisfactory meal.
category:
  - lunch
  - food
start: 2020-02-02
end: 2020-02-20
rsvp: Yes
location:
  type: adr
  country-name: United Kingdom
checkin:
  type: card
  latitude:
    - 50
  longitude:
    - 0
audio:
  - url: https://website.example/audio.mp3
photo:
  - alt: Alternative text
    url: https://website.example/photo.jpg
video:
  - url: https://website.example/video.mp4
bookmark-of: https://website.example
like-of: https://website.example
repost-of: https://website.example
in-reply-to: https://website.example
draft: true
visibility: private
syndication: https://website.example/post/12345
mp-syndicate-to: https://social.example
---
I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`);
});
