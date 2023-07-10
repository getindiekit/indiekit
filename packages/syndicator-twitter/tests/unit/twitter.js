import test from "ava";
import nock from "nock";
import { mockAgent } from "@indiekit-test/mock-agent";
import { twitter } from "../../lib/twitter.js";

await mockAgent("syndicator-twitter");

test.beforeEach((t) => {
  t.context = {
    apiResponse: {
      id_str: "1234567890987654321",
      user: { screen_name: "username" },
    },
    me: "https://website.example",
    media: (filename) => ({
      url: `https://website.example/${filename}`,
      alt: "Example image",
    }),
    tweetUrl: "https://twitter.com/username/status/1234567890987654321",
    statusId: "1234567890987654321",
    options: {
      apiKey: "0123456789abcdefghijklmno",
      apiKeySecret: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0123456789",
      accessTokenKey: "ABCDEFGHIJKLMNabcdefghijklmnopqrstuvwxyz0123456789",
      accessTokenSecret: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN",
      user: "username",
    },
  };
});

test("Posts a like", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/favorites/create.json")
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).postLike(t.context.tweetUrl);

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Throws error posting a like", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/favorites/create.json")
    .replyWithError("Not found");

  await t.throwsAsync(twitter(t.context.options).postLike(t.context.tweetUrl), {
    message: /Not found/,
  });
});

test("Throws API error posting a like", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/favorites/create.json")
    .reply(404, {
      errors: [{ message: "Not found" }],
    });

  await t.throwsAsync(twitter(t.context.options).postLike(t.context.tweetUrl), {
    message: /Not found/,
  });
});

test("Posts a retweet", async (t) => {
  nock("https://api.twitter.com")
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).postRetweet(
    t.context.tweetUrl
  );

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Throws error posting a retweet", async (t) => {
  nock("https://api.twitter.com")
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .replyWithError("Not found");

  await t.throwsAsync(
    twitter(t.context.options).postRetweet(t.context.tweetUrl),
    {
      message: /Not found/,
    }
  );
});

test("Throws API error posting a retweet", async (t) => {
  nock("https://api.twitter.com")
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .reply(404, {
      errors: [{ message: "Not found" }],
    });

  await t.throwsAsync(
    twitter(t.context.options).postRetweet(t.context.tweetUrl),
    {
      message: /Not found/,
    }
  );
});

test("Posts a status", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).postStatus(t.context.status);

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Throws error posting a status", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .replyWithError("Not found");

  await t.throwsAsync(twitter(t.context.options).postStatus(t.context.status), {
    message: /Not found/,
  });
});

test("Throws API error posting a status", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(404, {
      errors: [{ message: "Not found" }],
    });

  await t.throwsAsync(twitter(t.context.options).postStatus(t.context.status), {
    message: /Not found/,
  });
});

test("Throws error fetching media to upload", async (t) => {
  await t.throwsAsync(
    twitter(t.context.options).uploadMedia(
      t.context.media("404.jpg"),
      t.context.me
    ),
    {
      message: "Not Found",
    }
  );
});

test("Uploads media and returns a media id", async (t) => {
  nock("https://upload.twitter.com").post("/1.1/media/upload.json").reply(200, {
    media_id_string: "1234567890987654321",
  });
  nock("https://upload.twitter.com")
    .post("/1.1/media/metadata/create.json")
    .reply(200, {});

  const result = await twitter(t.context.options).uploadMedia(
    t.context.media("photo1.jpg"),
    t.context.me
  );

  t.is(result, "1234567890987654321");
});

test("Throws error uploading media", async (t) => {
  nock("https://upload.twitter.com")
    .post("/1.1/media/upload.json")
    .reply(404, {
      errors: [{ message: "Not found" }],
    });

  await t.throwsAsync(
    twitter(t.context.options).uploadMedia(
      t.context.media("photo2.jpg"),
      t.context.me
    ),
    {
      message: /Not found/,
    }
  );
});

test("Returns false passing an object to media upload function", async (t) => {
  const result = await twitter(t.context.options).uploadMedia(
    { foo: "bar" },
    t.context.me
  );

  t.falsy(result);
});

test("Posts a like of a tweet to Twitter", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/favorites/create.json")
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).post(
    {
      "like-of": t.context.tweetUrl,
    },
    t.context.me
  );

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Doesn’t post a like of a URL to Twitter", async (t) => {
  const result = await twitter(t.context.options).post(
    {
      "like-of": "https://foo.bar/lunchtime",
    },
    t.context.me
  );

  t.falsy(result);
});

test("Posts a repost of a tweet to Twitter", async (t) => {
  nock("https://api.twitter.com")
    .post(`/1.1/statuses/retweet/${t.context.statusId}.json`)
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).post(
    {
      "repost-of": t.context.tweetUrl,
    },
    t.context.me
  );

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Doesn’t post a repost of a URL to Twitter", async (t) => {
  const result = await twitter(t.context.options).post(
    {
      "repost-of": "https://foo.bar/lunchtime",
    },
    t.context.me
  );

  t.falsy(result);
});

test("Posts a quote status to Twitter", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).post(
    {
      content: {
        html: "<p>Someone else who likes cheese sandwiches.</p>",
      },
      "repost-of": t.context.tweetUrl,
      "post-type": "repost",
    },
    t.context.me
  );

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Posts a status to Twitter", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).post(
    {
      content: {
        html: "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
        text: "I ate a cheese sandwich, which was nice.",
      },
      url: "https://foo.bar/lunchtime",
    },
    t.context.me
  );

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Posts a status to Twitter with 4 out of 5 photos", async (t) => {
  nock("https://upload.twitter.com")
    .post("/1.1/media/upload.json")
    .reply(200, { media_id_string: "1" });
  nock("https://upload.twitter.com")
    .post("/1.1/media/upload.json")
    .reply(200, { media_id_string: "2" });
  nock("https://upload.twitter.com")
    .post("/1.1/media/upload.json")
    .reply(200, { media_id_string: "3" });
  nock("https://upload.twitter.com")
    .post("/1.1/media/upload.json")
    .reply(200, { media_id_string: "4" });
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, t.context.apiResponse);

  const result = await twitter(t.context.options).post(
    {
      content: {
        html: "<p>Here’s the cheese sandwiches I ate.</p>",
      },
      photo: [
        { url: `${t.context.me}/photo3.jpg` },
        { url: `${t.context.me}/photo4.jpg` },
        { url: `${t.context.me}/photo5.jpg` },
        { url: `${t.context.me}/photo6.jpg` },
        { url: `${t.context.me}/photo7.jpg` },
      ],
    },
    t.context.me
  );

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});
