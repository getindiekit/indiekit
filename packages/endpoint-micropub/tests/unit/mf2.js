import test from "ava";
import nock from "nock";
import parser from "microformats-parser";
import { getFixture } from "@indiekit-test/get-fixture";
import { getMf2Properties, jf2ToMf2, url2Mf2 } from "../../lib/mf2.js";

test.beforeEach((t) => {
  t.context = {
    mf2: parser.mf2(getFixture("html/post.html"), {
      baseUrl: "https://website.example/post.html",
    }),
    url: "https://website.example/post.html",
  };
});

test("Returns all mf2 properties of a post", (t) => {
  t.deepEqual(getMf2Properties(t.context.mf2), {
    properties: {
      name: ["I ate a cheese sandwich, which was nice."],
      published: ["2013-03-07"],
      content: ["I ate a cheese sandwich, which was nice."],
    },
  });
});

test("Returns requested mf2 properties of a post", (t) => {
  t.deepEqual(getMf2Properties(t.context.mf2, ["name", "published"]), {
    properties: {
      name: ["I ate a cheese sandwich, which was nice."],
      published: ["2013-03-07"],
    },
  });
});

test("Returns requested mf2 property of a post", (t) => {
  t.deepEqual(getMf2Properties(t.context.mf2, "name"), {
    properties: {
      name: ["I ate a cheese sandwich, which was nice."],
    },
  });
});

test("Returns mf2 item with empty object if property not found", (t) => {
  t.deepEqual(getMf2Properties(t.context.mf2, "location"), {
    properties: {},
  });
});

test("Throws error if mf2 has no items", (t) => {
  const mf2 = parser.mf2(getFixture("html/page.html"), {
    baseUrl: t.context.url,
  });

  t.throws(
    () => {
      getMf2Properties(mf2, "name");
    },
    {
      message: "Source has no items",
    }
  );
});

test("Converts JF2 to mf2 object", async (t) => {
  const feed = JSON.parse(getFixture("jf2/feed.jf2"));

  t.deepEqual(await jf2ToMf2(feed.children[0]), {
    type: ["h-entry"],
    properties: {
      uid: ["https://website.example/second-item"],
      url: ["https://website.example/second-item"],
      name: ["Second item in feed"],
      content: [
        {
          value: "This second item has all fields.",
          html: "<p>This second item has <strong>all</strong> fields.</p>",
        },
      ],
      summary: ["This is the second item"],
      featured: ["https://another.example/banner_image.jpg"],
      published: ["2020-12-31T17:05:55+00:00"],
      updated: ["2021-01-01T12:05:55+00:00"],
      author: [
        {
          name: "Joe Bloggs",
          url: "https://website.example/~joebloggs",
          photo: "https://website.example/~joebloggs/photo.jpg",
        },
      ],
      category: ["second", "example"],
      audio: [
        {
          url: "https://website.example/second-item/audio.weba",
          alt: "Audio",
          "content-type": "audio/webm",
        },
      ],
      photo: [
        {
          url: "https://website.example/second-item/photo.webp",
          alt: "Photo",
          "content-type": "image/webp",
        },
      ],
      video: [
        {
          url: "https://website.example/second-item/audio.webm",
          alt: "Video",
          "content-type": "video/webm",
        },
      ],
    },
  });
});

test("Returns mf2 from URL", async (t) => {
  nock("https://website.example")
    .get("/post.html")
    .reply(200, getFixture("html/post.html"));

  t.deepEqual(await url2Mf2(t.context.url), {
    rels: {},
    "rel-urls": {},
    items: [
      {
        type: ["h-entry"],
        properties: {
          name: ["I ate a cheese sandwich, which was nice."],
          published: ["2013-03-07"],
          content: ["I ate a cheese sandwich, which was nice."],
        },
      },
    ],
  });
});

test("Returns mf2 empty objects if no properties found", async (t) => {
  nock("https://website.example")
    .get("/post.html")
    .reply(200, getFixture("html/page.html"));

  t.deepEqual(await url2Mf2(t.context.url), {
    rels: {},
    "rel-urls": {},
    items: [],
  });
});

test("Throws error if URL not found", async (t) => {
  nock("https://website.example").get("/post.html").replyWithError("Not found");

  await t.throwsAsync(url2Mf2(t.context.url), {
    message: "Not found",
  });
});
