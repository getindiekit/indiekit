import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getFixture } from "@indiekit-test/fixtures";
import { getPostTemplate } from "../../lib/post-template.js";

describe("preset-jekyll/lib/post-template", async () => {
  const properties = JSON.parse(getFixture("jf2/post-template-properties.jf2"));

  it("Renders post template without content", () => {
    const result = getPostTemplate({
      published: "2020-02-02",
      updated: "2022-12-11",
      deleted: "2022-12-12",
      name: "What I had for lunch",
    });

    assert.equal(
      result,
      `---
date: 2020-02-02
publishDate: 2020-02-02
lastmod: 2022-12-11
expiryDate: 2022-12-12
title: What I had for lunch
---
`,
    );
  });

  it("Renders post template with basic draft content", () => {
    const result = getPostTemplate({
      published: "2020-02-02",
      name: "What I had for lunch",
      content:
        "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
      "post-status": "draft",
    });

    assert.equal(
      result,
      `---
date: 2020-02-02
publishDate: 2020-02-02
draft: true
title: What I had for lunch
---

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`,
    );
  });

  it("Renders post template with HTML content", () => {
    const result = getPostTemplate({
      published: "2020-02-02",
      name: "What I had for lunch",
      content: {
        html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>',
      },
    });

    assert.equal(
      result,
      `---
date: 2020-02-02
publishDate: 2020-02-02
title: What I had for lunch
---

<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>
`,
    );
  });

  it("Renders post template with JSON front matter", () => {
    const result = getPostTemplate(properties, "json");

    assert.equal(
      result,
      `{
  "date": "2020-02-02",
  "publishDate": "2020-02-02",
  "title": "What I had for lunch",
  "images": [
    "https://website.example/photo.jpg"
  ],
  "summary": "A very satisfactory meal.",
  "category": [
    "lunch",
    "food"
  ],
  "audio": [
    {
      "url": "https://website.example/audio.mp3"
    }
  ],
  "photo": [
    {
      "alt": "Alternative text",
      "url": "https://website.example/photo.jpg"
    }
  ],
  "video": [
    {
      "url": "https://website.example/video.mp4"
    }
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
  "bookmarkOf": "https://website.example",
  "likeOf": "https://website.example",
  "repostOf": "https://website.example",
  "inReplyTo": "https://website.example",
  "visibility": "private",
  "syndication": "https://website.example/post/12345"
}

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`,
    );
  });

  it("Renders post template with TOML front matter", () => {
    const result = getPostTemplate(properties, "toml");

    assert.equal(
      result,
      `+++
date = "2020-02-02"
publishDate = "2020-02-02"
title = "What I had for lunch"
images = [ "https://website.example/photo.jpg" ]
summary = "A very satisfactory meal."
category = [ "lunch", "food" ]
start = "2020-02-02"
end = "2020-02-20"
rsvp = "Yes"
bookmarkOf = "https://website.example"
likeOf = "https://website.example"
repostOf = "https://website.example"
inReplyTo = "https://website.example"
visibility = "private"
syndication = "https://website.example/post/12345"

[[audio]]
url = "https://website.example/audio.mp3"

[[photo]]
alt = "Alternative text"
url = "https://website.example/photo.jpg"

[[video]]
url = "https://website.example/video.mp4"

[location]
type = "geo"
latitude = "37.780080"
longitude = "-122.420160"
name = "37° 46′ 48.29″ N 122° 25′ 12.576″ W"
+++

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`,
    );
  });

  it("Renders post template with YAML front matter", () => {
    const result = getPostTemplate(properties, "yaml");

    assert.equal(
      result,
      `---
date: 2020-02-02
publishDate: 2020-02-02
title: What I had for lunch
images:
  - https://website.example/photo.jpg
summary: A very satisfactory meal.
category:
  - lunch
  - food
audio:
  - url: https://website.example/audio.mp3
photo:
  - alt: Alternative text
    url: https://website.example/photo.jpg
video:
  - url: https://website.example/video.mp4
start: 2020-02-02
end: 2020-02-20
rsvp: Yes
location:
  type: geo
  latitude: "37.780080"
  longitude: "-122.420160"
  name: 37° 46′ 48.29″ N 122° 25′ 12.576″ W
bookmarkOf: https://website.example
likeOf: https://website.example
repostOf: https://website.example
inReplyTo: https://website.example
visibility: private
syndication: https://website.example/post/12345
---

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`,
    );
  });
});
