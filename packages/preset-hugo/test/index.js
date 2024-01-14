import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";
import HugoPreset from "../index.js";

describe("preset-hugo", () => {
  const hugo = new HugoPreset();

  const properties = JSON.parse(getFixture("jf2/post-template-properties.jf2"));

  it("Gets plug-in info", () => {
    assert.equal(hugo.name, "Hugo preset");
    assert.equal(hugo.info.name, "Hugo");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      hugo.prompts[0].message,
      "Which front matter format are you using?",
    );
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    hugo.init(indiekit);

    assert.equal(indiekit.publication.preset.info.name, "Hugo");
  });

  it("Gets publication post types", () => {
    const result = hugo.postTypes;

    assert.equal(result[0].type, "article");
  });

  it("Renders post template without content", () => {
    const result = hugo.postTemplate({
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
    const result = hugo.postTemplate({
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
    const result = hugo.postTemplate({
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
    const hugo = new HugoPreset({ frontMatterFormat: "json" });
    const result = hugo.postTemplate(properties);

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
    const hugo = new HugoPreset({ frontMatterFormat: "toml" });
    const result = hugo.postTemplate(properties);

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
    const hugo = new HugoPreset({ frontMatterFormat: "yaml" });
    const result = hugo.postTemplate(properties);

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
