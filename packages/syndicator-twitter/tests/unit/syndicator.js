/* eslint-disable camelcase */
import test from "ava";
import nock from "nock";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";
import TwitterSyndicator from "../../index.js";

const twitter = new TwitterSyndicator({
  apiKey: "0123456789abcdefghijklmno",
  apiKeySecret: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0123456789",
  accessTokenKey: "ABCDEFGHIJKLMNabcdefghijklmnopqrstuvwxyz0123456789",
  accessTokenSecret: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN",
  user: "username",
});

test.beforeEach((t) => {
  t.context = {
    apiResponse: {
      id_str: "1234567890987654321",
      user: { screen_name: "username" },
    },
    properties: JSON.parse(
      getFixture("jf2/article-content-provided-html-text.jf2")
    ),
  };
});

test("Gets plug-in info", (t) => {
  t.is(twitter.name, "Twitter syndicator");
  t.false(twitter.info.checked);
  t.is(twitter.info.name, "username on Twitter");
  t.is(twitter.info.uid, "https://twitter.com/username");
  t.truthy(twitter.info.service);
});

test("Gets plug-in installation prompts", (t) => {
  t.is(twitter.prompts[0].message, "What is your Twitter username?");
});

test("Initiates plug-in", (t) => {
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

  const result = await twitter.syndicate(t.context.properties);

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

  const twitterNoOptions = new TwitterSyndicator({});

  await t.throwsAsync(twitterNoOptions.syndicate(t.context.properties), {
    message: "Twitter syndicator: Could not authenticate you.",
  });
});
