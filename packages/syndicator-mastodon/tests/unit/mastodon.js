import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { mastodon } from "../../lib/mastodon.js";

await mockAgent("syndicator-mastodon");

test.beforeEach((t) => {
  t.context = {
    me: "https://website.example",
    options: {
      accessToken: "token",
      serverUrl: "https://mastodon.example",
    },
    photo: [
      {
        url: "https://website.example/photo1.jpg",
        alt: "Example image",
      },
    ],
    statusParameters: { status: "Toot" },
    statusId: "1234567890987654321",
    statusUrl: "https://mastodon.example/@username/1234567890987654321",
  };
});

test("Posts a favourite", async (t) => {
  const { options, statusId, statusUrl } = t.context;
  const result = await mastodon(options).postFavourite(statusUrl);

  t.is(result, `https://mastodon.example/@username/${statusId}`);
});

test("Throws error posting a favourite", async (t) => {
  const { options, statusUrl } = t.context;
  options.accessToken = "invalid";

  await t.throwsAsync(mastodon(options).postFavourite(statusUrl), {
    message: "Unexpected error occurred",
  });
});

test("Posts a reblog", async (t) => {
  const { options, statusId, statusUrl } = t.context;
  const result = await mastodon(options).postReblog(statusUrl);

  t.is(result, `https://mastodon.example/@username/${statusId}`);
});

test("Throws error posting a reblog", async (t) => {
  const { options, statusUrl } = t.context;
  options.accessToken = "invalid";

  await t.throwsAsync(mastodon(options).postReblog(statusUrl), {
    message: "Unexpected error occurred",
  });
});

test("Posts a status", async (t) => {
  const { options, statusParameters, statusId } = t.context;
  const result = await mastodon(options).postStatus(statusParameters);

  t.is(result, `https://mastodon.example/@username/${statusId}`);
});

test("Throws error posting a status", async (t) => {
  const { options, statusParameters } = t.context;
  options.accessToken = "invalid";

  await t.throwsAsync(mastodon(options).postStatus(statusParameters), {
    message: "Unexpected error occurred",
  });
});

test("Throws error fetching media to upload", async (t) => {
  const { me, options } = t.context;
  await t.throwsAsync(
    mastodon(options).uploadMedia({ url: `${me}/404.jpg` }, me),
    {
      message: "Not Found",
    }
  );
});

test("Returns false passing an object to media upload function", async (t) => {
  const { me, options } = t.context;
  const result = await mastodon(options).uploadMedia({ foo: "bar" }, me);

  t.falsy(result);
});

test("Posts a favourite of a Mastodon status to Mastodon", async (t) => {
  const { me, options, statusUrl } = t.context;
  const result = await mastodon(options).post({ "like-of": statusUrl }, me);

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Doesn’t post a favourite of a URL to Mastodon", async (t) => {
  const { me, options } = t.context;
  const result = await mastodon(options).post(
    { "like-of": "https://foo.bar/lunchtime" },
    me
  );

  t.falsy(result);
});

test("Posts a repost of a Mastodon status to Mastodon", async (t) => {
  const { me, options, statusUrl } = t.context;
  const result = await mastodon(options).post({ "repost-of": statusUrl }, me);

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Doesn’t post a repost of a URL to Mastodon", async (t) => {
  const { me, options } = t.context;
  const result = await mastodon(options).post(
    { "repost-of": "https://foo.bar/lunchtime" },
    me
  );

  t.falsy(result);
});

test("Posts a quote status to Mastodon", async (t) => {
  const { me, options, statusUrl } = t.context;
  const result = await mastodon(options).post(
    {
      content: {
        html: "<p>Someone else who likes cheese sandwiches.</p>",
      },
      "repost-of": statusUrl,
      "post-type": "repost",
    },
    me
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Posts a status to Mastodon", async (t) => {
  const { me, options } = t.context;
  const result = await mastodon(options).post(
    {
      content: {
        html: "<p>I ate a <em>cheese</em> sandwich, which was nice.</p>",
        text: "I ate a cheese sandwich, which was nice.",
      },
      url: "https://foo.bar/lunchtime",
    },
    me
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Posts a status with photo to Mastodon", async (t) => {
  const { me, options, photo } = t.context;
  const result = await mastodon(options).post(
    {
      content: {
        html: "<p>Here’s the cheese sandwiches I ate.</p>",
      },
      photo,
    },
    me
  );

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Uploads media and returns a media id", async (t) => {
  const { me, options, photo } = t.context;
  const result = await mastodon(options).uploadMedia(photo[0], me);

  t.truthy(result);
});
