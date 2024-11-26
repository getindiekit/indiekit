import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";
import { mockAgent } from "@indiekit-test/mock-agent";

import InternetArchiveSyndicator from "../index.js";

await mockAgent("syndicator-internet-archive");

describe("syndicator-internet-archive", () => {
  const internetArchive = new InternetArchiveSyndicator({
    accessKey: "token",
    secretKey: "secret",
  });

  const url = "http://website.example/post/1";

  it("Gets plug-in environment", () => {
    assert.deepEqual(internetArchive.environment, [
      "INTERNET_ARCHIVE_ACCESS_KEY",
      "INTERNET_ARCHIVE_SECRET_KEY",
    ]);
  });

  it("Gets plug-in info", () => {
    assert.equal(internetArchive.name, "Internet Archive syndicator");
    assert.equal(internetArchive.info.checked, false);
    assert.equal(internetArchive.info.name, "Internet Archive");
    assert.equal(internetArchive.info.uid, "https://web.archive.org/");
    assert.ok(internetArchive.info.service);
  });

  it("Returns error information if no secret key provided", async () => {
    const result = new InternetArchiveSyndicator({
      accessKey: "token",
    });

    assert.equal(result.info.error, "Secret key required");
  });

  it("Returns error information if no access key provided", () => {
    const result = new InternetArchiveSyndicator({
      secretKey: "secret",
    });

    assert.equal(result.info.error, "Access key required");
  });

  it("Initiates plug-in", async () => {
    const indiekit = await Indiekit.initialize({ config: {} });
    internetArchive.init(indiekit);

    assert.equal(
      indiekit.publication.syndicationTargets[0].info.name,
      "Internet Archive",
    );
  });

  it("Returns syndicated URL", async () => {
    const result = await internetArchive.syndicate({ url });

    assert.equal(result, `https://web.archive.org/web/20180326070330/${url}`);
  });

  it("Throws error getting syndicated URL with no API keys", async () => {
    const internetArchiveNoKeys = new InternetArchiveSyndicator({});

    await assert.rejects(internetArchiveNoKeys.syndicate({ url }), {
      code: "indiekit",
      message:
        "Internet Archive syndicator: You need to be logged in to use Save Page Now.",
      name: "IndiekitError",
    });
  });
});
