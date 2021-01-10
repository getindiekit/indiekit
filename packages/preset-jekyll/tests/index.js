import test from 'ava';
import {getFixture} from './helpers/fixture.js';
import {JekyllPreset} from '../index.js';

test.beforeEach(t => {
  t.context.properties = JSON.parse(getFixture('properties.jf2.json'));
});

test('Gets publication post types', t => {
  const jekyll = new JekyllPreset();
  const result = jekyll.postTypes;
  t.is(result[0].type, 'article');
});

test('Renders post template without content', t => {
  const jekyll = new JekyllPreset();
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
  const jekyll = new JekyllPreset();
  const result = jekyll.postTemplate({
    published: '2020-02-02',
    name: 'Lunchtime',
    content: 'I ate a *cheese* sandwich, which was nice.'
  });
  t.is(result, `---
date: 2020-02-02
title: Lunchtime
---
I ate a *cheese* sandwich, which was nice.
`);
});

test('Renders post template with HTML content', t => {
  const jekyll = new JekyllPreset();
  const result = jekyll.postTemplate({
    published: '2020-02-02',
    name: 'Lunchtime',
    content: {
      html: '<p>I ate a <em>cheese</em> sandwich, which was nice.</p>'
    }
  });
  t.is(result, `---
date: 2020-02-02
title: Lunchtime
---
<p>I ate a <em>cheese</em> sandwich, which was nice.</p>
`);
});

test('Renders post template', t => {
  const jekyll = new JekyllPreset({frontmatterFormat: 'yaml'});
  const result = jekyll.postTemplate(t.context.properties);
  t.is(result, `---
date: 2020-02-02
title: Lunchtime
excerpt: What I ate.
category:
  - foo
  - bar
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
  - url: http://website.example/audio.mp3
photo:
  - alt: Alternative text
    url: http://website.example/photo.jpg
video:
  - url: http://website.example/video.mp4
bookmark-of: http://website.example
repost-of: http://website.example
in-reply-to: http://website.example
draft: true
visibility: private
syndication: http://website.example/post/12345
mp-syndicate-to: http://website.example
---
I ate a *cheese* sandwich, which was nice.
`);
});
