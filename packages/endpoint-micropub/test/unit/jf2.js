import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import {
  formEncodedToJf2,
  mf2ToJf2,
  getAudioProperty,
  getContentProperty,
  getLocationProperty,
  getPhotoProperty,
  getVideoProperty,
  getSlugProperty,
  getSyndicateToProperty,
  normaliseProperties,
} from "../../lib/jf2.js";

await mockAgent("endpoint-micropub");
const publication = {
  slugSeparator: "-",
  syndicationTargets: [
    {
      name: "Example social network",
      info: { uid: "https://mastodon.example/" },
    },
  ],
};

describe("endpoint-micropub/lib/jf2", () => {
  it("Creates JF2 object from form-encoded request", async () => {
    const result = await formEncodedToJf2({
      h: "entry",
      content: "I+ate+a+cheese+sandwich,+which+was+nice.",
      category: ["foo", "bar"],
      photo: ["https://website.example"],
      "mp-photo-alt": ["Example photo"],
    });

    assert.deepEqual(result, {
      type: "entry",
      content: "I ate a cheese sandwich, which was nice.",
      category: ["foo", "bar"],
      photo: ["https://website.example"],
      "mp-photo-alt": ["Example photo"],
    });
  });

  it("Converts mf2 to JF2", async () => {
    const result = await mf2ToJf2({
      type: ["h-entry"],
      properties: {
        content: ["I ate a cheese sandwich, which was nice."],
        category: ["foo", "bar"],
        photo: [
          {
            url: "https://website.example",
            alt: "Example photo",
          },
        ],
      },
    });

    assert.deepEqual(result, {
      type: "entry",
      content: "I ate a cheese sandwich, which was nice.",
      category: ["foo", "bar"],
      photo: [
        {
          url: "https://website.example",
          alt: "Example photo",
        },
      ],
    });
  });

  it("Converts mf2 to JF2 with referenced URL data", async () => {
    const result = await mf2ToJf2(
      {
        type: ["h-entry"],
        properties: {
          content: ["I ate a cheese sandwich, which was nice."],
          category: ["foo", "bar"],
          "bookmark-of": ["https://website.example/post"],
        },
      },
      true,
    );

    assert.deepEqual(result, {
      type: "entry",
      content: "I ate a cheese sandwich, which was nice.",
      category: ["foo", "bar"],
      "bookmark-of": "https://website.example/post",
      references: {
        "https://website.example/post": {
          type: "entry",
          name: "I ate a cheese sandwich, which was nice.",
          published: "2013-03-07",
          content: "I ate a cheese sandwich, which was nice.",
          url: "https://website.example/post",
        },
      },
    });
  });

  it("Gets audio property (from string)", () => {
    const properties = JSON.parse(
      getFixture("jf2/audio-provided-string-value.jf2"),
    );
    const result = getAudioProperty(properties, "https://website.example/");

    assert.deepEqual(result, [{ url: "baz.mp3" }]);
  });

  it("Gets audio property (from array)", () => {
    const properties = JSON.parse(getFixture("jf2/audio-provided-value.jf2"));
    const result = getAudioProperty(properties, "https://website.example/");

    assert.deepEqual(result, [
      { url: "baz.mp3" },
      { url: "https://foo.bar/qux.mp3" },
    ]);
  });

  it("Gets normalised audio property", () => {
    const properties = JSON.parse(getFixture("jf2/audio-provided.jf2"));
    const result = getAudioProperty(properties, "https://website.example/");

    assert.deepEqual(result, [
      { url: "baz.mp3" },
      { url: "https://foo.bar/qux.mp3" },
    ]);
  });

  it("Gets text and HTML values from `content` property", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-content-provided-html-text.jf2"),
    );
    const result = getContentProperty(properties);

    assert.deepEqual(result, {
      html: `<blockquote><p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from <a href="https://cafe.example">https://cafe.example</a>, which was &gt; 10.</p></blockquote><p>– Me, then.</p>`,
      text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
    });
  });

  it("Gets content from `content.html` property", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-content-provided-html.jf2"),
    );
    const result = getContentProperty(properties);

    assert.deepEqual(result, {
      html: `<blockquote><p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from <a href="https://cafe.example">https://cafe.example</a>, which was &gt; 10.</p></blockquote><p>– Me, then.</p>`,
      text: `> I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from [https://cafe.example](https://cafe.example), which was > 10.\n\n– Me, then.`,
    });
  });

  it("Gets content from `content.text` property", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-content-provided-text.jf2"),
    );
    const result = getContentProperty(properties);

    assert.deepEqual(result, {
      html: `<blockquote>\n<p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from https://cafe.example, which was &gt; 10.</p>\n</blockquote>\n<p>– Me, then.</p>`,
      text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
    });
  });

  it("Gets text content from `content` and adds HTML property", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-content-provided.jf2"),
    );
    const result = getContentProperty(properties);

    assert.deepEqual(result, {
      html: `<blockquote>\n<p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from https://cafe.example, which was &gt; 10.</p>\n</blockquote>\n<p>– Me, then.</p>`,
      text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
    });
  });

  it("Gets location property", () => {
    const properties = JSON.parse(getFixture("jf2/note-location-provided.jf2"));
    const result = getLocationProperty(properties);

    assert.deepEqual(result, {
      type: "geo",
      latitude: "37.780080",
      longitude: "-122.420160",
      name: "37° 46′ 48.29″ N 122° 25′ 12.576″ W",
    });
  });

  it("Gets location property by parsing provided Geo URI", () => {
    const properties = { location: "geo:37.780080,-122.420160" };
    const result = getLocationProperty(properties);

    assert.deepEqual(result, {
      type: "geo",
      latitude: "37.780080",
      longitude: "-122.420160",
    });
  });

  it("Gets location property parsing Geo URI with altitude and uncertainty", () => {
    const properties = { location: "geo:37.780080,-122.420160,1.0;u=65" };
    const result = getLocationProperty(properties);

    assert.deepEqual(result, {
      type: "geo",
      latitude: "37.780080",
      longitude: "-122.420160",
      altitude: "1.0",
    });
  });

  it("Gets photo property (from string)", () => {
    const properties = JSON.parse(
      getFixture("jf2/photo-provided-string-value.jf2"),
    );
    const result = getPhotoProperty(properties, "https://website.example/");

    assert.deepEqual(result, [{ url: "baz.jpg" }]);
  });

  it("Gets photo property (from array)", () => {
    const properties = JSON.parse(getFixture("jf2/photo-provided.jf2"));
    const result = getPhotoProperty(properties, "https://website.example/");

    assert.deepEqual(result, [
      { url: "baz.jpg" },
      { url: "https://foo.bar/qux.jpg" },
    ]);
  });

  it("Gets normalised photo property", () => {
    const properties = JSON.parse(
      getFixture("jf2/photo-provided-value-alt.jf2"),
    );
    const result = getPhotoProperty(properties, "https://website.example/");

    assert.deepEqual(result, [
      { url: "baz.jpg", alt: "Baz" },
      { url: "https://foo.bar/qux.jpg", alt: "Qux" },
    ]);
  });

  it("Gets normalised photo property, adding provided text alternatives", () => {
    const properties = JSON.parse(
      getFixture("jf2/photo-provided-mp-photo-alt.jf2"),
    );
    const result = getPhotoProperty(properties, "https://website.example/");

    assert.deepEqual(result, [
      { url: "baz.jpg", alt: "Baz" },
      { url: "https://foo.bar/qux.jpg", alt: "Qux" },
    ]);
  });

  it("Gets video property (from string)", () => {
    const properties = JSON.parse(
      getFixture("jf2/video-provided-string-value.jf2"),
    );
    const result = getVideoProperty(properties, "https://website.example/");

    assert.deepEqual(result, [{ url: "baz.mp4" }]);
  });

  it("Gets video property (from array)", () => {
    const properties = JSON.parse(getFixture("jf2/video-provided-value.jf2"));
    const result = getVideoProperty(properties, "https://website.example/");

    assert.deepEqual(result, [
      { url: "baz.mp4" },
      { url: "https://foo.bar/qux.mp4" },
    ]);
  });

  it("Gets normalised video property", () => {
    const properties = JSON.parse(getFixture("jf2/video-provided.jf2"));
    const result = getVideoProperty(properties, "https://website.example/");

    assert.deepEqual(result, [
      { url: "baz.mp4" },
      { url: "https://foo.bar/qux.mp4" },
    ]);
  });

  it("Derives slug from `mp-slug` property", () => {
    const properties = JSON.parse(getFixture("jf2/note-slug-provided.jf2"));
    const result = getSlugProperty(properties, "-");

    assert.equal(result, "cheese-sandwich");
  });

  it("Derives slug from unslugified `mp-slug` property", () => {
    const properties = JSON.parse(
      getFixture("jf2/note-slug-provided-unslugified.jf2"),
    );
    const result = getSlugProperty(properties, "-");

    assert.equal(result, "cheese-sandwich");
  });

  it("Derives slug, ignoring empty `mp-slug` property", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-slug-provided-empty.jf2"),
    );
    const result = getSlugProperty(properties, "-");

    assert.equal(result, "what-i-had-for-lunch");
  });

  it("Derives slug from `name` property", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-content-provided-text.jf2"),
    );
    const result = getSlugProperty(properties, "-");

    assert.equal(result, "what-i-had-for-lunch");
  });

  it("Derives slug by generating random string", () => {
    const properties = JSON.parse(
      getFixture("jf2/note-slug-missing-no-name.jf2"),
    );
    const result = getSlugProperty(properties, "-");

    assert.match(result, /\w{5}/g);
  });

  it("Does not add syndication target if no syndicators", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-syndicate-to-provided.jf2"),
    );
    const syndicationTargets = [];
    const result = getSyndicateToProperty(properties, syndicationTargets);

    assert.equal(result, undefined);
  });

  it("Adds syndication target", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-syndicate-to-provided.jf2"),
    );
    const syndicationTargets = [
      {
        info: { uid: "https://example.website/" },
      },
    ];
    const result = getSyndicateToProperty(properties, syndicationTargets);

    assert.deepEqual(result, ["https://example.website/"]);
  });

  it("Doesn’t add unused syndication target", () => {
    const properties = false;
    const syndicationTargets = [
      {
        info: { uid: "https://example.website/" },
      },
    ];
    const result = getSyndicateToProperty(properties, syndicationTargets);

    assert.equal(result, undefined);
  });

  it("Doesn’t add unchecked syndication target", () => {
    const properties = {
      properties: {
        "syndicate-to": "https://another.example",
      },
    };
    const syndicationTargets = [
      {
        info: { uid: "https://example.website/" },
      },
    ];
    const result = getSyndicateToProperty(properties, syndicationTargets);

    assert.equal(result, undefined);
  });

  it("Doesn’t add unavailable syndication target", () => {
    const properties = {
      properties: {
        "syndicate-to": "https://another.example",
      },
    };
    const syndicationTargets = [];
    const result = getSyndicateToProperty(properties, syndicationTargets);

    assert.equal(result, undefined);
  });

  it("Normalises JF2 (few properties)", () => {
    const properties = JSON.parse(
      getFixture("jf2/article-content-provided.jf2"),
    );
    const result = normaliseProperties(publication, properties, "UTC");

    assert.equal(result.type, "entry");
    assert.equal(result.name, "What I had for lunch");
    assert.equal(result["mp-slug"], "what-i-had-for-lunch");
    assert.deepEqual(result.content, {
      html: `<blockquote>\n<p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from https://cafe.example, which was &gt; 10.</p>\n</blockquote>\n<p>– Me, then.</p>`,
      text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
    });
    assert.equal(result.audio, undefined);
    assert.equal(result.photo, undefined);
    assert.equal(result.video, undefined);
  });

  it("Normalises JF2 (all properties)", () => {
    const properties = JSON.parse(getFixture("jf2/all-properties.jf2"));
    const result = normaliseProperties(publication, properties, "UTC");

    assert.equal(result.type, "entry");
    assert.equal(result.name, "What I had for lunch");
    assert.deepEqual(result.content, {
      html: `<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>`,
      text: "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
    });
    assert.deepEqual(result.audio, [
      { url: "https://website.example/audio.mp3" },
    ]);
    assert.deepEqual(result.photo, [
      { url: "https://website.example/photo.jpg", alt: "Alternative text" },
    ]);
    assert.deepEqual(result.video, [
      { url: "https://website.example/video.mp4" },
    ]);
    assert.deepEqual(result.category, ["lunch", "food"]);
    assert.deepEqual(result["mp-syndicate-to"], ["https://mastodon.example"]);
  });

  it("Normalises JF2 (syndication properties)", () => {
    const properties = JSON.parse(getFixture("jf2/all-properties.jf2"));
    delete properties["mp-syndicate-to"];
    properties.syndication = ["https://mastodon.example/status/1"];
    const result = normaliseProperties(publication, properties, "UTC");

    assert.equal(result.type, "entry");
    assert.equal(result.name, "What I had for lunch");
    assert.equal(result.syndication[0], "https://mastodon.example/status/1");
    assert.equal(result["mp-syndicate-to"], undefined);
  });

  it("Normalises JF2 (trims name property)", () => {
    const result = normaliseProperties(
      publication,
      {
        name: "  What I had for lunch  ",
      },
      "UTC",
    );

    assert.equal(result.name, "What I had for lunch");
  });
});
