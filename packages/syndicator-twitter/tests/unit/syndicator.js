/* eslint-disable camelcase */
import test from "ava";
import nock from "nock";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/get-fixture";
import { TwitterSyndicator } from "../../index.js";

test.beforeEach((t) => {
  t.context = {
    apiResponse: {
      id_str: "1234567890987654321",
      user: { screen_name: "username" },
    },
    options: {
      apiKey: "0123456789abcdefghijklmno",
      apiKeySecret: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0123456789",
      accessTokenKey: "ABCDEFGHIJKLMNabcdefghijklmnopqrstuvwxyz0123456789",
      accessTokenSecret: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN",
      user: "username",
    },
    properties: JSON.parse(
      getFixture("jf2/article-content-provided-html-text.jf2")
    ),
  };
});

test("Gets plug-in info", (t) => {
  const result = new TwitterSyndicator(t.context.options);

  t.is(result.name, "Twitter syndicator");
  t.false(result.info.checked);
  t.is(result.info.name, "username on Twitter");
  t.is(result.info.uid, "https://twitter.com/username");
  t.truthy(result.info.service);
});

test("Initiates plug-in", (t) => {
  const twitter = new TwitterSyndicator(t.context.options);
  const indiekit = new Indiekit();
  twitter.init(indiekit);

  t.is(
    indiekit.publication.syndicationTargets[0].info.name,
    "username on Twitter"
  );
});

test("Returns syndicated URL", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, t.context.apiResponse);
  const syndicator = new TwitterSyndicator(t.context.options);

  const result = await syndicator.syndicate(t.context.properties);

  t.is(result, "https://twitter.com/username/status/1234567890987654321");
});

test("Throws error getting syndicated URL with no API keys", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(401, {
      errors: [
        {
          message: "Could not authenticate you.",
        },
      ],
    });
  const syndicator = new TwitterSyndicator({});

  await t.throwsAsync(syndicator.syndicate(t.context.properties), {
    message: "Could not authenticate you.",
  });
});
