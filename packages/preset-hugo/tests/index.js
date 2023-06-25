import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";
import HugoPreset from "../index.js";

const hugo = new HugoPreset();

test.beforeEach((t) => {
  t.context.properties = JSON.parse(getFixture("jf2/all-properties.jf2"));
});

test("Gets plug-in info", (t) => {
  t.is(hugo.name, "Hugo preset");
  t.is(hugo.info.name, "Hugo");
});

test("Gets plug-in installation prompts", (t) => {
  t.is(hugo.prompts[0].message, "Which front matter format are you using?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  hugo.init(indiekit);

  t.is(indiekit.publication.preset.info.name, "Hugo");
});

test("Gets publication post types", (t) => {
  const result = hugo.postTypes;

  t.is(result[0].type, "article");
});

test("Renders post template without content", (t) => {
  const result = hugo.postTemplate({
    published: "2020-02-02",
    updated: "2022-12-11",
    deleted: "2022-12-12",
    name: "What I had for lunch",
  });

  t.is(
    result,
    `---
date: 2020-02-02
publishDate: 2020-02-02
lastmod: 2022-12-11
expiryDate: 2022-12-12
title: What I had for lunch
---
`
  );
});

test("Renders post template with basic content", (t) => {
  const result = hugo.postTemplate({
    published: "2020-02-02",
    name: "What I had for lunch",
    content:
      "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
  });

  t.is(
    result,
    `---
date: 2020-02-02
publishDate: 2020-02-02
title: What I had for lunch
---

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`
  );
});

test("Renders post template with HTML content", (t) => {
  const result = hugo.postTemplate({
    published: "2020-02-02",
    name: "What I had for lunch",
    content: {
      html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>',
    },
  });

  t.is(
    result,
    `---
date: 2020-02-02
publishDate: 2020-02-02
title: What I had for lunch
---

<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>
`
  );
});

test("Renders post template with JSON front matter", (t) => {
  const hugo = new HugoPreset({ frontMatterFormat: "json" });
  const result = hugo.postTemplate(t.context.properties);

  t.is(
    result,
    `{
  "date": "2020-02-02",
  "publishDate": "2020-02-02",
  "title": "What I had for lunch",
  "summary": "A very satisfactory meal.",
  "category": [
    "lunch",
    "food"
  ],
  "start": "2020-02-02",
  "end": "2020-02-20",
  "rsvp": "Yes",
  "location": {
    "type": "geo",
    "latitude": "37.780080",
    "longitude": "-122.420160",
    "name": "37° 46′ 48.29″ N 122° 25′ 12.576″ W"
  },
  "checkin": {
    "type": "card",
    "latitude": "50",
    "longitude": "0"
  },
  "audio": [
    {
      "url": "https://website.example/audio.mp3"
    }
  ],
  "images": [
    {
      "alt": "Alternative text",
      "url": "https://website.example/photo.jpg"
    }
  ],
  "videos": [
    {
      "url": "https://website.example/video.mp4"
    }
  ],
  "bookmarkOf": "https://website.example",
  "likeOf": "https://website.example",
  "repostOf": "https://website.example",
  "inReplyTo": "https://website.example",
  "draft": true,
  "visibility": "private",
  "syndication": "https://website.example/post/12345"
}

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`
  );
});

test("Renders post template with TOML front matter", (t) => {
  const hugo = new HugoPreset({ frontMatterFormat: "toml" });
  const result = hugo.postTemplate(t.context.properties);

  t.is(
    result,
    `+++
date = "2020-02-02"
publishDate = "2020-02-02"
title = "What I had for lunch"
summary = "A very satisfactory meal."
category = [ "lunch", "food" ]
start = "2020-02-02"
end = "2020-02-20"
rsvp = "Yes"
bookmarkOf = "https://website.example"
likeOf = "https://website.example"
repostOf = "https://website.example"
inReplyTo = "https://website.example"
draft = true
visibility = "private"
syndication = "https://website.example/post/12345"

[location]
type = "geo"
latitude = "37.780080"
longitude = "-122.420160"
name = "37° 46′ 48.29″ N 122° 25′ 12.576″ W"

[checkin]
type = "card"
latitude = "50"
longitude = "0"

[[audio]]
url = "https://website.example/audio.mp3"

[[images]]
alt = "Alternative text"
url = "https://website.example/photo.jpg"

[[videos]]
url = "https://website.example/video.mp4"
+++

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`
  );
});

test("Renders post template with YAML front matter", (t) => {
  const hugo = new HugoPreset({ frontMatterFormat: "yaml" });
  const result = hugo.postTemplate(t.context.properties);

  t.is(
    result,
    `---
date: 2020-02-02
publishDate: 2020-02-02
title: What I had for lunch
summary: A very satisfactory meal.
category:
  - lunch
  - food
start: 2020-02-02
end: 2020-02-20
rsvp: Yes
location:
  type: geo
  latitude: "37.780080"
  longitude: "-122.420160"
  name: 37° 46′ 48.29″ N 122° 25′ 12.576″ W
checkin:
  type: card
  latitude: "50"
  longitude: "0"
audio:
  - url: https://website.example/audio.mp3
images:
  - alt: Alternative text
    url: https://website.example/photo.jpg
videos:
  - url: https://website.example/video.mp4
bookmarkOf: https://website.example
likeOf: https://website.example
repostOf: https://website.example
inReplyTo: https://website.example
draft: true
visibility: private
syndication: https://website.example/post/12345
---

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`
  );
});
