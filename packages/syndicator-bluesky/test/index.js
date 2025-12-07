import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { TestNetworkNoAppView } from "@atproto/dev-env";
import { Indiekit } from "@indiekit/indiekit";
import { getFixture } from "@indiekit-test/fixtures";

import BlueskySyndicator from "../index.js";

describe("syndicator-bluesky", async () => {
  let bluesky;
  let network;

  before(async () => {
    network = await TestNetworkNoAppView.create({
      dbPostgresSchema: "api_atp_agent",
    });

    const client = network.getSeedClient();
    await client.createAccount("alice", {
      email: "alice@alice.test",
      handle: "alice.test",
      password: "password",
    });

    bluesky = new BlueskySyndicator({
      handle: "alice.test",
      password: "password",
      serviceUrl: network.pds.url,
    });
  });

  after(async () => {
    await network.close();
  });

  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-html-text.jf2"),
  );

  const publication = {
    me: "https://website.test",
  };

  it("Gets plug-in environment", () => {
    assert.deepEqual(bluesky.environment, ["BLUESKY_PASSWORD"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(bluesky.name, "Bluesky syndicator");
    assert.equal(bluesky.info.checked, false);
    assert.equal(bluesky.info.name, "@alice.test");
    assert.equal(bluesky.info.uid, "https://bsky.app/profile/alice.test");
    assert.ok(bluesky.info.service);
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      bluesky.prompts[0].message,
      "What is your Bluesky handle (without the @)?",
    );
  });

  it("Returns error information if no username provided", () => {
    const result = new BlueskySyndicator({
      password: "password",
    });

    assert.equal(result.info.error, "User identifier required");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    bluesky.init(indiekit);

    assert.equal(
      indiekit.publication.syndicationTargets[0].info.name,
      "@alice.test",
    );
  });

  it("Returns syndicated URL", async () => {
    const result = await bluesky.syndicate(properties, publication);

    assert.ok(result);
  });

  it("Throws error getting syndicated URL if password missing", async () => {
    const blueskyNoPassword = new BlueskySyndicator({
      handle: "alice.test",
    });

    await assert.rejects(blueskyNoPassword.syndicate(properties, publication), {
      message: `Bluesky syndicator: Input must have the property "password"`,
    });
  });
});
