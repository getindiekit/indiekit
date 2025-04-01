import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";

import AtProtoSyndicator from "../index.js";

describe("syndicator-atproto", () => {
  const atproto = new AtProtoSyndicator({
    password: "password",
    profileUrl: "https://butterfly.app/profile",
    serviceUrl: "https://butterfly.social",
    user: "username.butterfly.social",
  });

  it("Gets plug-in environment", () => {
    assert.deepEqual(atproto.environment, ["ATPROTO_PASSWORD"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(atproto.name, "AT Protocol syndicator");
    assert.equal(atproto.info.checked, false);
    assert.equal(atproto.info.name, "@username.butterfly.social");
    assert.equal(
      atproto.info.uid,
      "https://butterfly.app/profile/username.butterfly.social",
    );
    assert.ok(atproto.info.service);
  });

  it("Returns error information if no service URL provided", async () => {
    const result = new AtProtoSyndicator({
      password: "password",
      profileUrl: "https://butterfly.app/profile",
      user: "username",
    });

    assert.equal(result.info.error, "Service URL required");
  });

  it("Returns error information if no profile URL provided", async () => {
    const result = new AtProtoSyndicator({
      password: "password",
      serviceUrl: "https://butterfly.social",
      user: "username",
    });

    assert.equal(result.info.error, "Profile URL required");
  });

  it("Returns error information if no username provided", () => {
    const result = new AtProtoSyndicator({
      password: "password",
      profileUrl: "https://butterfly.app/profile",
      serviceUrl: "https://butterfly.social",
    });

    assert.equal(result.info.error, "User identifier required");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    atproto.init(indiekit);

    assert.equal(
      indiekit.publication.syndicationTargets[0].info.name,
      "@username.butterfly.social",
    );
  });

  it.todo("Returns syndicated URL");

  it.todo("Throws error getting syndicated URL if access token invalid");
});
