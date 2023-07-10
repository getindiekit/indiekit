import test from "ava";
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

test.beforeEach((t) => {
  t.context = {
    publication: {
      slugSeparator: "-",
      syndicationTargets: [
        {
          name: "Example social network",
          info: { uid: "https://mastodon.example/" },
        },
      ],
    },
  };
});

test("Creates JF2 object from form-encoded request", (t) => {
  const result = formEncodedToJf2({
    h: "entry",
    content: "I+ate+a+cheese+sandwich,+which+was+nice.",
    category: ["foo", "bar"],
    photo: ["https://website.example"],
    "mp-photo-alt": ["Example photo"],
  });

  t.deepEqual(result, {
    type: "entry",
    content: "I ate a cheese sandwich, which was nice.",
    category: ["foo", "bar"],
    photo: ["https://website.example"],
    "mp-photo-alt": ["Example photo"],
  });
});

test("Converts mf2 to JF2", async (t) => {
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

  t.deepEqual(result, {
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

test("Converts mf2 to JF2 with referenced URL data", async (t) => {
  const result = await mf2ToJf2(
    {
      type: ["h-entry"],
      properties: {
        content: ["I ate a cheese sandwich, which was nice."],
        category: ["foo", "bar"],
        "bookmark-of": ["https://website.example/post"],
      },
    },
    true
  );

  t.deepEqual(result, {
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

test("Gets audio property (from string)", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/audio-provided-string-value.jf2")
  );
  const result = getAudioProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.mp3" }]);
});

test("Gets audio property (from array)", (t) => {
  const properties = JSON.parse(getFixture("jf2/audio-provided-value.jf2"));
  const result = getAudioProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.mp3" }, { url: "https://foo.bar/qux.mp3" }]);
});

test("Gets normalised audio property", (t) => {
  const properties = JSON.parse(getFixture("jf2/audio-provided.jf2"));
  const result = getAudioProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.mp3" }, { url: "https://foo.bar/qux.mp3" }]);
});

test("Gets text and HTML values from `content` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-html-text.jf2")
  );
  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: `<blockquote><p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from <a href="https://cafe.example">https://cafe.example</a>, which was &gt; 10.</p></blockquote><p>– Me, then.</p>`,
    text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
  });
});

test("Gets content from `content.html` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-html.jf2")
  );
  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: `<blockquote><p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from <a href="https://cafe.example">https://cafe.example</a>, which was &gt; 10.</p></blockquote><p>– Me, then.</p>`,
    text: `> I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from [https://cafe.example](https://cafe.example), which was > 10.\n\n– Me, then.`,
  });
});

test("Gets content from `content.text` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-text.jf2")
  );
  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: `<blockquote>\n<p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from https://cafe.example, which was &gt; 10.</p>\n</blockquote>\n<p>– Me, then.</p>`,
    text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
  });
});

test("Gets text content from `content` and adds HTML property", (t) => {
  const properties = JSON.parse(getFixture("jf2/article-content-provided.jf2"));
  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: `<blockquote>\n<p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from https://cafe.example, which was &gt; 10.</p>\n</blockquote>\n<p>– Me, then.</p>`,
    text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
  });
});

test("Gets location property", (t) => {
  const properties = JSON.parse(getFixture("jf2/note-location-provided.jf2"));
  const result = getLocationProperty(properties);

  t.deepEqual(result, {
    type: "geo",
    latitude: "37.780080",
    longitude: "-122.420160",
    name: "37° 46′ 48.29″ N 122° 25′ 12.576″ W",
  });
});

test("Gets location property by parsing provided Geo URI", (t) => {
  const properties = { location: "geo:37.780080,-122.420160" };
  const result = getLocationProperty(properties);

  t.deepEqual(result, {
    type: "geo",
    latitude: "37.780080",
    longitude: "-122.420160",
  });
});

test("Gets location property parsing Geo URI with altitude and uncertainty", (t) => {
  const properties = { location: "geo:37.780080,-122.420160,1.0;u=65" };
  const result = getLocationProperty(properties);

  t.deepEqual(result, {
    type: "geo",
    latitude: "37.780080",
    longitude: "-122.420160",
    altitude: "1.0",
  });
});

test("Gets photo property (from string)", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/photo-provided-string-value.jf2")
  );
  const result = getPhotoProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.jpg" }]);
});

test("Gets photo property (from array)", (t) => {
  const properties = JSON.parse(getFixture("jf2/photo-provided.jf2"));
  const result = getPhotoProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.jpg" }, { url: "https://foo.bar/qux.jpg" }]);
});

test("Gets normalised photo property", (t) => {
  const properties = JSON.parse(getFixture("jf2/photo-provided-value-alt.jf2"));
  const result = getPhotoProperty(properties, "https://website.example/");

  t.deepEqual(result, [
    { url: "baz.jpg", alt: "Baz" },
    { url: "https://foo.bar/qux.jpg", alt: "Qux" },
  ]);
});

test("Gets normalised photo property, adding provided text alternatives", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/photo-provided-mp-photo-alt.jf2")
  );
  const result = getPhotoProperty(properties, "https://website.example/");

  t.deepEqual(result, [
    { url: "baz.jpg", alt: "Baz" },
    { url: "https://foo.bar/qux.jpg", alt: "Qux" },
  ]);
});

test("Gets video property (from string)", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/video-provided-string-value.jf2")
  );
  const result = getVideoProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.mp4" }]);
});

test("Gets video property (from array)", (t) => {
  const properties = JSON.parse(getFixture("jf2/video-provided-value.jf2"));
  const result = getVideoProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.mp4" }, { url: "https://foo.bar/qux.mp4" }]);
});

test("Gets normalised video property", (t) => {
  const properties = JSON.parse(getFixture("jf2/video-provided.jf2"));
  const result = getVideoProperty(properties, "https://website.example/");

  t.deepEqual(result, [{ url: "baz.mp4" }, { url: "https://foo.bar/qux.mp4" }]);
});

test("Derives slug from `mp-slug` property", (t) => {
  const properties = JSON.parse(getFixture("jf2/note-slug-provided.jf2"));
  const result = getSlugProperty(properties, "-");

  t.is(result, "cheese-sandwich");
});

test("Derives slug from unslugified `mp-slug` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/note-slug-provided-unslugified.jf2")
  );
  const result = getSlugProperty(properties, "-");

  t.is(result, "cheese-sandwich");
});

test("Derives slug, ignoring empty `mp-slug` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-slug-provided-empty.jf2")
  );
  const result = getSlugProperty(properties, "-");

  t.is(result, "what-i-had-for-lunch");
});

test("Derives slug from `name` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-text.jf2")
  );
  const result = getSlugProperty(properties, "-");

  t.is(result, "what-i-had-for-lunch");
});

test("Derives slug by generating random number", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/note-slug-missing-no-name.jf2")
  );
  const result = getSlugProperty(properties, "-");

  t.regex(result, /[\w-]{5}/g);
});

test("Does not add syndication target if no syndicators", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-syndicate-to-provided.jf2")
  );
  const syndicationTargets = [];
  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.falsy(result);
});

test("Adds syndication target checked by client", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-syndicate-to-provided.jf2")
  );
  const syndicationTargets = [
    {
      info: { uid: "https://example.website/" },
    },
  ];
  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.deepEqual(result, ["https://example.website/"]);
});

test("Adds syndication target not checked by client but forced by server", (t) => {
  const properties = false;
  const syndicationTargets = [
    {
      info: { uid: "https://example.website/" },
      options: { forced: true },
    },
  ];
  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.deepEqual(result, ["https://example.website/"]);
});

test("Adds syndication target checked by client and forced by server", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-syndicate-to-provided.jf2")
  );
  const syndicationTargets = [
    {
      info: { uid: "https://example.website/" },
      options: { forced: true },
    },
  ];
  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.deepEqual(result, ["https://example.website/"]);
});

test("Adds syndication targets, one checked by client, one forced by server", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-syndicate-to-provided.jf2")
  );
  const syndicationTargets = [
    {
      info: { uid: "https://example.website/" },
    },
    {
      info: { uid: "https://another-example.website/" },
      options: { forced: true },
    },
  ];
  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.deepEqual(result, [
    "https://example.website/",
    "https://another-example.website/",
  ]);
});

test("Doesn’t add unused syndication target", (t) => {
  const properties = false;
  const syndicationTargets = [
    {
      info: { uid: "https://example.website/" },
    },
  ];
  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.falsy(result);
});

test("Doesn’t add unchecked syndication target", (t) => {
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

  t.falsy(result);
});

test("Doesn’t add unavailable syndication target", (t) => {
  const properties = {
    properties: {
      "syndicate-to": "https://another.example",
    },
  };
  const syndicationTargets = [];
  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.falsy(result);
});

test("Normalises JF2 (few properties)", (t) => {
  const properties = JSON.parse(getFixture("jf2/article-content-provided.jf2"));
  const result = normaliseProperties(t.context.publication, properties);

  t.is(result.type, "entry");
  t.is(result.name, "What I had for lunch");
  t.is(result["mp-slug"], "what-i-had-for-lunch");
  t.deepEqual(result.content, {
    html: `<blockquote>\n<p>I <del>ate</del><ins>had</ins> a <cite><a href="https://en.wikipedia.org/wiki/Cheese">cheese</a></cite> sandwich from https://cafe.example, which was &gt; 10.</p>\n</blockquote>\n<p>– Me, then.</p>`,
    text: "> I <del>ate</del><ins>had</ins> a <cite>[cheese](https://en.wikipedia.org/wiki/Cheese)</cite> sandwich from https://cafe.example, which was > 10.\n\n-- Me, then.",
  });
  t.falsy(result.audio);
  t.falsy(result.photo);
  t.falsy(result.video);
});

test("Normalises JF2 (all properties)", (t) => {
  const properties = JSON.parse(getFixture("jf2/all-properties.jf2"));
  const result = normaliseProperties(t.context.publication, properties);

  t.is(result.type, "entry");
  t.is(result.name, "What I had for lunch");
  t.deepEqual(result.content, {
    html: `<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>`,
    text: "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
  });
  t.deepEqual(result.audio, [{ url: "https://website.example/audio.mp3" }]);
  t.deepEqual(result.photo, [
    { url: "https://website.example/photo.jpg", alt: "Alternative text" },
  ]);
  t.deepEqual(result.video, [{ url: "https://website.example/video.mp4" }]);
  t.deepEqual(result.category, ["lunch", "food"]);
  t.deepEqual(result["mp-syndicate-to"], ["https://mastodon.example"]);
});

test("Normalises JF2 (syndication properties)", (t) => {
  const properties = JSON.parse(getFixture("jf2/all-properties.jf2"));
  delete properties["mp-syndicate-to"];
  properties.syndication = ["https://mastodon.example/status/1"];
  const result = normaliseProperties(t.context.publication, properties);

  t.is(result.type, "entry");
  t.is(result.name, "What I had for lunch");
  t.is(result.syndication[0], "https://mastodon.example/status/1");
  t.falsy(result["mp-syndicate-to"]);
});

test("Normalises JF2 (trims name property)", (t) => {
  const result = normaliseProperties(t.context.publication, {
    name: "  What I had for lunch  ",
  });

  t.is(result.name, "What I had for lunch");
});
