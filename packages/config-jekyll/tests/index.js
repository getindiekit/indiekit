import test from 'ava';
import {getFixture} from './helpers/fixture.js';
import {JekyllConfig} from '../index.js';

test.beforeEach(t => {
  t.context.properties = JSON.parse(getFixture('properties.json'));
});

test('Gets publication config', async t => {
  const jekyllConfig = new JekyllConfig();
  const result = jekyllConfig.config;
  t.is(result['post-types'][0].type, 'article');
});

test('Render post template without content', t => {
  const jekyllConfig = new JekyllConfig();
  const result = jekyllConfig.postTemplate({
    published: ['2020-02-02'],
    name: ['I ate a cheese sandwich']
  });
  t.is(result, `---
date: 2020-02-02
title: I ate a cheese sandwich
---
`);
});

test('Renders post template', t => {
  const jekyllConfig = new JekyllConfig({frontmatterFormat: 'yaml'});
  const result = jekyllConfig.postTemplate(t.context.properties);
  t.is(result, `---
date: 2020-02-02
title: I ate a cheese sandwich
excerpt: What I ate.
category:
  - foo
  - bar
start: 2020-02-02
end: 2020-02-20
rsvp: Yes
location:
  country-name:
    - United Kingdom
checkin:
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
syndicate-to:
  - http://website.example
---
I ate a cheese sandwich, which was nice.
`);
});
