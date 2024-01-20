import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";
import JekyllPreset from "../index.js";

describe("preset-jekyll", () => {
  const jekyll = new JekyllPreset();

  const properties = JSON.parse(getFixture("jf2/post-template-properties.jf2"));

  it("Gets plug-in info", () => {
    assert.equal(jekyll.name, "Jekyll preset");
    assert.equal(jekyll.info.name, "Jekyll");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    jekyll.init(indiekit);

    assert.equal(indiekit.publication.preset.info.name, "Jekyll");
  });

  it("Gets publication post types", () => {
    const result = jekyll.postTypes;

    assert.equal(result[0].type, "article");
  });

  it("Renders post template without content", () => {
    const result = jekyll.postTemplate({
      published: "2020-02-02",
      updated: "2022-12-11",
      deleted: "2022-12-12",
      name: "Lunchtime",
    });

    assert.equal(
      result,
      `---
date: 2020-02-02
title: Lunchtime
updated: 2022-12-11
deleted: 2022-12-12
---
`,
    );
  });

  it("Renders post template with basic draft content", () => {
    const result = jekyll.postTemplate({
      published: "2020-02-02",
      name: "Lunchtime",
      content:
        "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
      post_status: "draft",
    });

    assert.equal(
      result,
      `---
date: 2020-02-02
title: Lunchtime
published: false
---

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`,
    );
  });

  it("Renders post template with HTML content", () => {
    const result = jekyll.postTemplate({
      published: "2020-02-02",
      name: "Lunchtime",
      content: {
        html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>',
      },
    });

    assert.equal(
      result,
      `---
date: 2020-02-02
title: Lunchtime
---

<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>
`,
    );
  });

  it("Renders post template", () => {
    const jekyll = new JekyllPreset();
    const result = jekyll.postTemplate(properties);

    assert.equal(
      result,
      `---
date: 2020-02-02
title: What I had for lunch
excerpt: A very satisfactory meal.
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
bookmark_of: https://website.example
like_of: https://website.example
repost_of: https://website.example
in_reply_to: https://website.example
visibility: private
syndication: https://website.example/post/12345
---

I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.
`,
    );
  });
});
