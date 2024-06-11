import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import AtProtoSyndicator from "../index.js";

describe("syndicator-atproto", () => {
  const atproto = new AtProtoSyndicator({
    password: "password",
    url: "https://butterfly.example",
    user: "username.butterfly.example",
  });

  it("Gets plug-in environment", () => {
    assert.deepEqual(atproto.environment, ["ATPROTO_PASSWORD"]);
  });

  it("Gets plug-in info", () => {
    assert.equal(atproto.name, "AT Protocol syndicator");
    assert.equal(atproto.info.checked, false);
    assert.equal(atproto.info.name, "@username.butterfly.example");
    assert.equal(atproto.info.uid, "https://username.butterfly.example");
    assert.ok(atproto.info.service);
  });

  it("Returns error information if no server URL provided", async () => {
    const result = new AtProtoSyndicator({
      password: "password",
      user: "username",
    });

    assert.equal(result.info.error, "Service URL required");
  });

  it("Returns error information if no username provided", () => {
    const result = new AtProtoSyndicator({
      password: "password",
      url: "https://username.butterfly.example",
    });

    assert.equal(result.info.error, "User identifier required");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    atproto.init(indiekit);

    assert.equal(
      indiekit.publication.syndicationTargets[0].info.name,
      "@username.butterfly.example",
    );
  });

  it.todo("Returns syndicated URL");

  it.todo("Throws error getting syndicated URL if access token invalid");
});
