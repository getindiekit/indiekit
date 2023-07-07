import test from "ava";
import nock from "nock";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";
import MastodonSyndicator from "../index.js";

const mastodon = new MastodonSyndicator({
  accessToken: "token",
  url: "https://mastodon.example",
  user: "username",
});

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
    properties: JSON.parse(
      getFixture("jf2/article-content-provided-html-text.jf2")
    ),
    instanceUrl: "https://mastodon.example",
  };
});

test("Gets plug-in info", (t) => {
  t.is(mastodon.name, "Mastodon syndicator");
  t.false(mastodon.info.checked);
  t.is(mastodon.info.name, "@username@mastodon.example");
  t.is(mastodon.info.uid, "https://mastodon.example/@username");
  t.truthy(mastodon.info.service);
});

test("Gets plug-in installation prompts", (t) => {
  t.is(mastodon.prompts[0].message, "What is the URL of your Mastodon server?");
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  mastodon.init(indiekit);

  t.is(
    indiekit.publication.syndicationTargets[0].info.name,
    "@username@mastodon.example"
  );
});

test("Returns syndicated URL", async (t) => {
  nock(t.context.instanceUrl)
    .post("/api/v1/statuses")
    .reply(200, t.context.apiResponse);

  const result = await mastodon.syndicate(t.context.properties);

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Throws error getting syndicated URL if no server URL provided", async (t) => {
  const mastodonNoServer = new MastodonSyndicator({
    accessToken: "token",
    user: "username",
  });

  await t.throwsAsync(mastodonNoServer.syndicate(t.context.properties), {
    message: "Mastodon syndicator: Mastodon server URL required",
  });
});

test("Throws error getting username if no username provided", (t) => {
  const mastodonNoUser = new MastodonSyndicator({
    accessToken: "token",
    url: t.context.instanceUrl,
  });

  t.throws(
    () => {
      mastodonNoUser.info.name();
    },
    { message: "Mastodon user name required" }
  );
});

test("Throws error getting syndicated URL if no access token provided", async (t) => {
  nock(t.context.instanceUrl)
    .post("/api/v1/statuses")
    .reply(401, {
      errors: [
        {
          message: "Mastodon syndicator: Request failed with status code 401",
        },
      ],
    });

  const mastodonNoToken = new MastodonSyndicator({
    url: t.context.instanceUrl,
    user: "username",
  });

  await t.throwsAsync(mastodonNoToken.syndicate(t.context.properties), {
    message: "Mastodon syndicator: Request failed with status code 401",
  });
});
