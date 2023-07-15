import test from "ava";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import MastodonSyndicator from "../index.js";

await mockAgent("syndicator-mastodon");

const mastodon = new MastodonSyndicator({
  accessToken: "token",
  url: "https://mastodon.example",
  user: "username",
});

test.beforeEach((t) => {
  t.context = {
    properties: JSON.parse(
      getFixture("jf2/article-content-provided-html-text.jf2")
    ),
    publication: {
      me: "https://website.example",
    },
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
  const { properties, publication } = t.context;
  const result = await mastodon.syndicate(properties, publication);

  t.is(result, "https://mastodon.example/@username/1234567890987654321");
});

test("Throws error getting syndicated URL if no server URL provided", async (t) => {
  const { properties, publication } = t.context;
  const mastodonNoServer = new MastodonSyndicator({
    accessToken: "token",
    user: "username",
  });

  await t.throwsAsync(mastodonNoServer.syndicate(properties, publication), {
    message: "Mastodon syndicator: Mastodon server URL required",
  });
});

test("Throws error getting username if no username provided", (t) => {
  const mastodonNoUser = new MastodonSyndicator({
    accessToken: "token",
    url: "https://mastodon.example",
  });

  t.throws(
    () => {
      mastodonNoUser.info.name();
    },
    { message: "Mastodon user name required" }
  );
});

test("Throws error getting syndicated URL if no access token provided", async (t) => {
  const { properties, publication } = t.context;
  const mastodonNoToken = new MastodonSyndicator({
    url: "https://mastodon.example",
    user: "username",
  });

  await t.throwsAsync(mastodonNoToken.syndicate(properties, publication), {
    message: "Mastodon syndicator: Unexpected error occurred",
  });
});
