/* eslint-disable camelcase */
import test from "ava";
import nock from "nock";
import { getFixture } from "@indiekit-test/get-fixture";
import { MastodonSyndicator } from "../../index.js";

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
    options: {
      accessToken: "0123456789abcdefghijklmno",
      url: "https://mastodon.example",
      user: "username",
    },
    properties: JSON.parse(
      getFixture("jf2/article-content-provided-html-text.jf2")
    ),
  };
});

test("Gets plug-in info", (t) => {
  const result = new MastodonSyndicator(t.context.options);

  t.is(result.name, "Mastodon syndicator");
  t.false(result.info.checked);
  t.is(result.info.name, "@username@mastodon.example");
  t.is(result.info.uid, "https://mastodon.example/@username");
  t.truthy(result.info.service);
});

test("Returns syndicated URL", async (t) => {
  nock(t.context.options.url)
    .post("/api/v1/statuses")
    .reply(200, t.context.apiResponse);
  const syndicator = new MastodonSyndicator(t.context.options);

  const result = await syndicator.syndicate(t.context.properties);

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Throws error getting syndicated URL if no server URL provided", async (t) => {
  const syndicator = new MastodonSyndicator({
    accessToken: t.context.options.accessToken,
    user: "username",
  });

  await t.throwsAsync(syndicator.syndicate(t.context.properties), {
    message: "Mastodon server URL required",
  });
});

test("Throws error getting syndicated URL if no access token provided", async (t) => {
  nock(t.context.options.url)
    .post("/api/v1/statuses")
    .reply(401, {
      errors: [
        {
          message: "Request failed with status code 401",
        },
      ],
    });
  const syndicator = new MastodonSyndicator({
    url: t.context.options.url,
    user: "username",
  });

  await t.throwsAsync(syndicator.syndicate(t.context.properties), {
    message: "Request failed with status code 401",
  });
});
