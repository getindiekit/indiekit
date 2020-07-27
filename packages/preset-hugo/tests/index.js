import test from 'ava';
import {getFixture} from './helpers/fixture.js';
import {HugoPreset} from '../index.js';

test.beforeEach(t => {
  t.context.properties = JSON.parse(getFixture('properties.jf2.json'));
});

test('Gets publication config', t => {
  const hugo = new HugoPreset();
  const result = hugo.config;
  t.is(result['post-types'][0].type, 'article');
});

test('Renders post template (defaults to YAML frontmatter)', t => {
  const hugo = new HugoPreset();
  const result = hugo.postTemplate({
    published: '2020-02-02',
    name: 'I ate a cheese sandwich'
  });
  t.is(result, `---
date: 2020-02-02
title: I ate a cheese sandwich
---
`);
});

test('Renders post template with JSON frontmatter', t => {
  const hugo = new HugoPreset({frontmatterFormat: 'json'});
  const result = hugo.postTemplate(t.context.properties);
  t.is(result, `{
  "date": "2020-02-02",
  "title": "I ate a cheese sandwich",
  "summary": "What I ate.",
  "category": [
    "foo",
    "bar"
  ],
  "start": "2020-02-02",
  "end": "2020-02-20",
  "rsvp": "Yes",
  "location": {
    "type": "adr",
    "country-name": "United Kingdom"
  },
  "checkin": {
    "type": "card",
    "latitude": [
      50
    ],
    "longitude": [
      0
    ]
  },
  "audio": [
    {
      "url": "http://website.example/audio.mp3"
    }
  ],
  "images": [
    {
      "alt": "Alternative text",
      "url": "http://website.example/photo.jpg"
    }
  ],
  "videos": [
    {
      "url": "http://website.example/video.mp4"
    }
  ],
  "bookmark-of": "http://website.example",
  "repost-of": "http://website.example",
  "in-reply-to": "http://website.example",
  "syndicate-to": "http://website.example"
}
<p>I ate a <i>cheese</i> sandwich, which was nice.</p>
`);
});

test('Renders post template with TOML frontmatter', t => {
  const hugo = new HugoPreset({frontmatterFormat: 'toml'});
  const result = hugo.postTemplate(t.context.properties);
  t.is(result, `+++
date = "2020-02-02"
title = "I ate a cheese sandwich"
summary = "What I ate."
category = [ "foo", "bar" ]
start = "2020-02-02"
end = "2020-02-20"
rsvp = "Yes"
bookmark-of = "http://website.example"
repost-of = "http://website.example"
in-reply-to = "http://website.example"
syndicate-to = "http://website.example"

[location]
type = "adr"
country-name = "United Kingdom"

[checkin]
type = "card"
latitude = [ 50 ]
longitude = [ 0 ]

[[audio]]
url = "http://website.example/audio.mp3"

[[images]]
alt = "Alternative text"
url = "http://website.example/photo.jpg"

[[videos]]
url = "http://website.example/video.mp4"
+++
<p>I ate a <i>cheese</i> sandwich, which was nice.</p>
`);
});

test('Renders post template with YAML frontmatter', t => {
  const hugo = new HugoPreset({frontmatterFormat: 'yaml'});
  const result = hugo.postTemplate(t.context.properties);
  t.is(result, `---
date: 2020-02-02
title: I ate a cheese sandwich
summary: What I ate.
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
images:
  - alt: Alternative text
    url: http://website.example/photo.jpg
videos:
  - url: http://website.example/video.mp4
bookmark-of: http://website.example
repost-of: http://website.example
in-reply-to: http://website.example
syndicate-to: http://website.example
---
<p>I ate a <i>cheese</i> sandwich, which was nice.</p>
`);
});
