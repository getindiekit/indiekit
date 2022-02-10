import test from "ava";
import dateFns from "date-fns";
import { getFixture } from "@indiekit-test/get-fixture";
import {
  formEncodedToJf2,
  mf2ToJf2,
  getAudioProperty,
  getContentProperty,
  getLocationProperty,
  getPhotoProperty,
  getVideoProperty,
  getPublishedProperty,
  getSlugProperty,
  getSyndicateToProperty,
  normaliseProperties,
} from "../../lib/jf2.js";

const { isValid, parseISO } = dateFns;

test.beforeEach((t) => {
  t.context = {
    publication: {
      slugSeparator: "-",
      syndicationTargets: [
        {
          name: "Example social network",
          uid: "https://social.example/",
        },
      ],
      timeZone: "UTC",
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

test("Converts mf2 to JF2", (t) => {
  const result = mf2ToJf2({
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

test("Gets existing text and HTML values from `content` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/note-content-provided-html-text.jf2")
  );

  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: "<p>I ate a <i>cheese</i> sandwich, which was nice.</p>",
    text: "I ate a cheese sandwich, which was nice.",
  });
});

test("Gets existing HTML from `content` property and adds text value", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/note-content-provided-html.jf2")
  );

  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: "<p>I ate a <i>cheese</i> sandwich, which was nice.</p>",
    text: "I ate a *cheese* sandwich, which was nice.",
  });
});

test("Gets content from `content.text` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-text.jf2")
  );

  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
    text: "I ate a *cheese* sandwich, which was nice.",
  });
});

test("Gets content from `content` property", (t) => {
  const properties = JSON.parse(getFixture("jf2/article-content-provided.jf2"));

  const result = getContentProperty(properties);

  t.deepEqual(result, {
    html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>',
    text: "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
  });
});

test("Gets location property", (t) => {
  const properties = JSON.parse(getFixture("jf2/checkin.jf2"));

  const result = getLocationProperty(properties);

  t.deepEqual(result, {
    properties: {
      latitude: "37.780080",
      longitude: "-122.420160",
    },
  });
});

test("Gets location property by parsing provided Geo URI", (t) => {
  const properties = { location: "geo:37.780080,-122.420160" };

  const result = getLocationProperty(properties);

  t.deepEqual(result, {
    properties: {
      latitude: "37.780080",
      longitude: "-122.420160",
    },
  });
});

test("Gets location property, parsing Geo URI with altitude and uncertainty values", (t) => {
  const properties = { location: "geo:37.780080,-122.420160,1.0;u=65" };

  const result = getLocationProperty(properties);

  t.deepEqual(result, {
    properties: {
      latitude: "37.780080",
      longitude: "-122.420160",
      altitude: "1.0",
    },
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

test("Gets date from `published` property", (t) => {
  const properties = JSON.parse(getFixture("jf2/note-published-provided.jf2"));

  const result = getPublishedProperty(properties);

  t.is(result, "2019-01-02T03:04:05.678Z");
});

test("Gets date from `published` property (short date)", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/note-published-provided-short.jf2")
  );

  const result = getPublishedProperty(properties);

  t.is(result, "2019-01-02T00:00:00.000Z");
});

test("Gets date by using current date", (t) => {
  const properties = JSON.parse(getFixture("jf2/note-published-missing.jf2"));

  const result = getPublishedProperty(properties);

  t.true(isValid(parseISO(result)));
});

test("Derives slug from `mp-slug` property", (t) => {
  const properties = JSON.parse(getFixture("jf2/note-slug-provided.jf2"));

  const slug = getSlugProperty(properties, "-");

  t.is(slug, "cheese-sandwich");
});

test("Derives slug from unslugified `mp-slug` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/note-slug-provided-unslugified.jf2")
  );

  const slug = getSlugProperty(properties, "-");

  t.is(slug, "cheese-sandwich");
});

test("Derives slug, ignoring empty `mp-slug` property", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/article-slug-provided-empty.jf2")
  );

  const slug = getSlugProperty(properties, "-");

  t.is(slug, "what-i-had-for-lunch");
});

test("Derives slug from `name` property", (t) => {
  const properties = JSON.parse(getFixture("jf2/article-content-provided.jf2"));

  const slug = getSlugProperty(properties, "-");

  t.is(slug, "what-i-had-for-lunch");
});

test("Derives slug by generating random number", (t) => {
  const properties = JSON.parse(
    getFixture("jf2/note-slug-missing-no-name.jf2")
  );

  const slug = getSlugProperty(properties, "-");

  t.regex(slug, /[\d\w]{5}/g);
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
      uid: "https://example.website/",
    },
  ];

  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.deepEqual(result, ["https://example.website/"]);
});

test("Adds syndication target not checked by client but forced by server", (t) => {
  const properties = false;
  const syndicationTargets = [
    {
      uid: "https://example.website/",
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
      uid: "https://example.website/",
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
      uid: "https://example.website/",
    },
    {
      uid: "https://another-example.website/",
      options: { forced: true },
    },
  ];

  const result = getSyndicateToProperty(properties, syndicationTargets);

  t.deepEqual(result, [
    "https://example.website/",
    "https://another-example.website/",
  ]);
});

test("Doesn’t add unavilable syndication target", (t) => {
  const properties = false;
  const syndicationTargets = [
    {
      uid: "https://example.website/",
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
      uid: "https://example.website/",
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
    html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>',
    text: "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
  });
  t.falsy(result.audio);
  t.falsy(result.photo);
  t.falsy(result.video);
  t.true(isValid(parseISO(result.published)));
});

test("Normalises JF2 (all properties)", (t) => {
  const properties = JSON.parse(getFixture("jf2/all-properties.jf2"));

  const result = normaliseProperties(t.context.publication, properties);

  t.is(result.type, "entry");
  t.is(result.name, "What I had for lunch");
  t.deepEqual(result.content, {
    html: '<p>I ate a <a href="https://en.wikipedia.org/wiki/Cheese">cheese</a> sandwich, which was nice.</p>',
    text: "I ate a [cheese](https://en.wikipedia.org/wiki/Cheese) sandwich, which was nice.",
  });
  t.deepEqual(result.audio, [{ url: "https://website.example/audio.mp3" }]);
  t.deepEqual(result.photo, [
    { url: "https://website.example/photo.jpg", alt: "Alternative text" },
  ]);
  t.deepEqual(result.video, [{ url: "https://website.example/video.mp4" }]);
  t.deepEqual(result.category, ["lunch", "food"]);
  t.true(isValid(parseISO(result.published)));
  t.is(result["mp-syndicate-to"], "https://social.example");
});
