import test from "ava";
import nock from "nock";
import { getFixture } from "@indiekit-test/fixtures";
import { mastodon } from "../../lib/mastodon.js";

test.beforeEach((t) => {
  t.context = {
    apiResponse: {
      emojis: [],
      id: "1234567890987654321",
      media_attachments: [],
      mentions: [],
      tags: [],
      url: "https://mastodon.example/@username/1234567890987654321",
    },
    media: {
      url: "https://website.example/image.jpg",
      alt: "Example image",
    },
    tootUrl: "https://mastodon.example/@username/1234567890987654321",
    status: "Toot",
    statusId: "1234567890987654321",
    options: {
      accessToken: "0123456789abcdefghijklmno",
      serverUrl: "https://mastodon.example",
    },
    publication: {
      me: "https://website.example",
    },
  };
});

test("Posts a favourite", async (t) => {
  nock(t.context.options.serverUrl)
    .post(`/api/v1/statuses/${t.context.statusId}/favourite`)
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).postFavourite(
    t.context.tootUrl
  );

  t.is(result, `https://mastodon.example/@username/${t.context.statusId}`);
});

test("Throws error posting a favourite", async (t) => {
  nock(t.context.options.serverUrl)
    .post(`/api/v1/statuses/${t.context.statusId}/favourite`)
    .reply(404, { message: "Not found" });

  await t.throwsAsync(
    mastodon(t.context.options).postFavourite(t.context.tootUrl),
    {
      message: "Request failed with status code 404",
    }
  );
});

test("Posts a reblog", async (t) => {
  nock(t.context.options.serverUrl)
    .post(`/api/v1/statuses/${t.context.statusId}/reblog`)
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).postReblog(
    t.context.tootUrl
  );

  t.is(result, `https://mastodon.example/@username/${t.context.statusId}`);
});

test("Throws error posting a reblog", async (t) => {
  nock(t.context.options.serverUrl)
    .post(`/api/v1/statuses/${t.context.statusId}/reblog`)
    .reply(404, { message: "Not found" });

  await t.throwsAsync(
    mastodon(t.context.options).postReblog(t.context.tootUrl),
    {
      message: "Request failed with status code 404",
    }
  );
});

test("Posts a status", async (t) => {
  nock(t.context.options.serverUrl)
    .post("/api/v1/statuses")
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).postStatus(t.context.status);

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Throws error posting a status", async (t) => {
  nock(t.context.options.serverUrl)
    .post("/api/v1/statuses")
    .reply(404, { message: "Not found" });

  await t.throwsAsync(
    mastodon(t.context.options).postStatus(t.context.status),
    {
      message: "Request failed with status code 404",
    }
  );
});

test.serial("Throws error fetching media to upload", async (t) => {
  nock("https://website.example").get("/image.jpg").replyWithError("Not found");

  await t.throwsAsync(
    mastodon(t.context.options).uploadMedia(
      t.context.media,
      t.context.publication.me
    ),
    {
      message: /Not found/,
    }
  );
});

// Fails as Nock doesn’t send _httpMessage.path value used by form-data module
test.failing("Uploads media and returns a media id", async (t) => {
  nock("https://website.example")
    .get("/image.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock(t.context.options.serverUrl).post("/api/v1/media").reply(200, {
    id: "1234567890987654321",
  });
  nock(t.context.options.serverUrl).post("/api/v1/media").reply(200, {});

  const result = await mastodon(t.context.options).uploadMedia(
    t.context.media,
    t.context.publication.me
  );

  t.is(result, "1234567890987654321");
});

// Fails as Nock doesn’t send _httpMessage.path value used by form-data module
test.failing("Throws error uploading media", async (t) => {
  nock("https://website.example")
    .get("/image.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock(t.context.options.serverUrl)
    .post("/api/v1/media")
    .reply(404, { message: "Not found" });

  await t.throwsAsync(
    mastodon(t.context.options).uploadMedia(
      t.context.media,
      t.context.publication.me
    ),
    {
      message: "Request failed with status code 404",
    }
  );
});

test("Returns false passing an object to media upload function", async (t) => {
  const result = await mastodon(t.context.options).uploadMedia(
    { foo: "bar" },
    t.context.publication.me
  );

  t.falsy(result);
});

test("Posts a favourite of a toot to Mastodon", async (t) => {
  nock(t.context.options.serverUrl)
    .post(`/api/v1/statuses/${t.context.statusId}/favourite`)
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).post(
    {
      "like-of": t.context.tootUrl,
    },
    t.context.publication
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Doesn’t post a favourite of a URL to Mastodon", async (t) => {
  const result = await mastodon(t.context.options).post(
    {
      "like-of": "https://foo.bar/lunchtime",
    },
    t.context.publication
  );

  t.falsy(result);
});

test("Posts a repost of a toot to Mastodon", async (t) => {
  nock(t.context.options.serverUrl)
    .post(`/api/v1/statuses/${t.context.statusId}/reblog`)
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).post(
    {
      "repost-of": t.context.tootUrl,
    },
    t.context.publication
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Doesn’t post a repost of a URL to Mastodon", async (t) => {
  const result = await mastodon(t.context.options).post(
    {
      "repost-of": "https://foo.bar/lunchtime",
    },
    t.context.publication
  );

  t.falsy(result);
});

test("Posts a quote status to Mastodon", async (t) => {
  nock(t.context.options.serverUrl)
    .post("/api/v1/statuses")
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).post(
    {
      content: {
        html: "<p>Someone else who likes cheese sandwiches.</p>",
      },
      "repost-of": t.context.tootUrl,
      "post-type": "repost",
    },
    t.context.publication
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Posts a status to Mastodon", async (t) => {
  nock(t.context.options.serverUrl)
    .post("/api/v1/statuses")
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).post(
    {
      content: {
        html: "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
        text: "I ate a cheese sandwich, which was nice.",
      },
      url: "https://foo.bar/lunchtime",
    },
    t.context.publication
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

// Fails as Nock doesn’t send _httpMessage.path value used by form-data module
test.failing("Posts a status to Mastodon with 4 out of 5 photos", async (t) => {
  nock(t.context.publication.me)
    .get("/image1.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock(t.context.publication.me)
    .get("/image2.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock(t.context.publication.me)
    .get("/image3.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock("https://website.example")
    .get("/image4.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock(t.context.options.url).post("/api/v1/media").reply(200, { id: "1" });
  nock(t.context.options.url).post("/api/v1/media").reply(200, { id: "2" });
  nock(t.context.options.url).post("/api/v1/media").reply(200, { id: "3" });
  nock(t.context.options.url).post("/api/v1/media").reply(200, { id: "4" });
  nock(t.context.options.url)
    .post("/api/v1/statuses")
    .reply(200, t.context.apiResponse);

  const result = await mastodon(t.context.options).post(
    {
      content: {
        html: "<p>Here’s the cheese sandwiches I ate.</p>",
      },
      photo: [
        { url: `${t.context.publication.me}/image1.jpg` },
        { url: `${t.context.publication.me}/image2.jpg` },
        { url: "image3.jpg" },
        { url: "https://website.example/image4.jpg" },
        { url: "https://website.example/image5.jpg" },
      ],
    },
    t.context.publication
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Throws an error posting a status to Mastodon with 4 out of 5 photos", async (t) => {
  nock(t.context.publication.me)
    .get("/image1.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock(t.context.publication.me)
    .get("/image2.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock(t.context.publication.me)
    .get("/image3.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });
  nock("https://website.example")
    .get("/image4.jpg")
    .reply(200, { body: getFixture("file-types/photo.jpg", false) });

  await t.throwsAsync(
    mastodon(t.context.options).post(
      {
        content: {
          html: "<p>Here’s the cheese sandwiches I ate.</p>",
        },
        photo: [
          { url: `${t.context.publication.me}/image1.jpg` },
          { url: `${t.context.publication.me}/image2.jpg` },
          { url: "image3.jpg" },
          { url: "https://website.example/image4.jpg" },
          { url: "https://website.example/image5.jpg" },
        ],
      },
      t.context.publication
    ),
    {
      message: "Cannot read properties of undefined (reading 'path')",
    }
  );
});
