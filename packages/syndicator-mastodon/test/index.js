import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import MastodonSyndicator from "../index.js";

await mockAgent("syndicator-mastodon");

describe("syndicator-mastodon", () => {
  const mastodon = new MastodonSyndicator({
    accessToken: "token",
    url: "https://mastodon.example",
    user: "username",
  });

  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-html-text.jf2"),
  );

  const publication = {
    me: "https://website.example",
  };

  it("Gets plug-in environment", () => {
    assert.deepEqual(mastodon.environment, ["MASTODON_ACCESS_TOKEN"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(mastodon.name, "Mastodon syndicator");
    assert.equal(mastodon.info.checked, false);
    assert.equal(mastodon.info.name, "@username@mastodon.example");
    assert.equal(mastodon.info.uid, "https://mastodon.example/@username");
    assert.ok(mastodon.info.service);
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      mastodon.prompts[0].message,
      "What is the URL of your Mastodon server?",
    );
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    mastodon.init(indiekit);

    assert.equal(
      indiekit.publication.syndicationTargets[0].info.name,
      "@username@mastodon.example",
    );
  });

  it("Returns syndicated URL", async () => {
    const result = await mastodon.syndicate(properties, publication);

    assert.equal(
      result,
      "https://mastodon.example/@username/1234567890987654321",
    );
  });

  it("Throws error getting syndicated URL if no server URL provided", async () => {
    const mastodonNoServer = new MastodonSyndicator({
      accessToken: "token",
      user: "username",
    });

    await assert.rejects(mastodonNoServer.syndicate(properties, publication), {
      message: "Mastodon syndicator: Mastodon server URL required",
    });
  });

  it("Throws error getting username if no username provided", () => {
    const mastodonNoUser = new MastodonSyndicator({
      accessToken: "token",
      url: "https://mastodon.example",
    });

    assert.throws(
      () => {
        mastodonNoUser.info.name;
      },
      { message: "Mastodon user name required" },
    );
  });

  it("Throws error getting syndicated URL if access token invalid", async () => {
    const mastodonNoToken = new MastodonSyndicator({
      accessToken: "invalid",
      url: "https://mastodon.example",
      user: "username",
    });

    await assert.rejects(mastodonNoToken.syndicate(properties, publication), {
      message: "Mastodon syndicator: The access token is invalid",
    });
  });
});
