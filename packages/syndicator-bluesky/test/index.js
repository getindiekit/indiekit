import { strict as assert } from "node:assert";
import { before, describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";
import { MockPds } from "@indiekit-test/atproto-pds";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testPublication } from "@indiekit-test/publication";

import BlueskySyndicator from "../index.js";

describe("syndicator-bluesky", async () => {
  const pds = new MockPds();
  pds.createAccount("alice.test");

  let /** @type {BlueskySyndicator} */ bluesky;

  before(async () => {
    await mockAgent("syndicator-bluesky", { pds });

    bluesky = new BlueskySyndicator({
      handle: "alice.test",
      password: "password",
      serviceUrl: pds.origin,
    });
  });

  const properties = JSON.parse(
    getFixture("jf2/article-content-provided-html-text.jf2"),
  );

  const publication = testPublication({
    me: "https://website.test",
  });

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

  it("Returns error information if profile URL invalid", () => {
    const result = new BlueskySyndicator({
      handle: "alice.test",
      password: "password",
      profileUrl: "",
    });

    assert.equal(result.info.error, "Valid profile URL required");
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

  it("Throws error getting syndicated URL with no password", async () => {
    const blueskyNoPassword = new BlueskySyndicator({
      handle: "alice.test",
      password: "",
    });

    await assert.rejects(blueskyNoPassword.syndicate(properties, publication), {
      message:
        "Bluesky syndicator: No password. Set the `password` option or `BLUESKY_PASSWORD`.",
      status: 401,
    });
  });
});

/**
 * @import { Bluesky } from "../lib/bluesky.js"
 */
