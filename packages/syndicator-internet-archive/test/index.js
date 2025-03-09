import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import InternetArchiveSyndicatorPlugin from "../index.js";

await mockAgent("syndicator-internet-archive");

describe("syndicator-internet-archive", () => {
  const internetArchive = new InternetArchiveSyndicatorPlugin({
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
    const result = new InternetArchiveSyndicatorPlugin({
      accessKey: "token",
    });

    assert.equal(result.info.error, "Secret key required");
  });

  it("Returns error information if no access key provided", () => {
    const result = new InternetArchiveSyndicatorPlugin({
      secretKey: "secret",
    });

    assert.equal(result.info.error, "Access key required");
  });

  it("Returns syndicated URL", async () => {
    const result = await internetArchive.syndicate({ url });

    assert.equal(result, `https://web.archive.org/web/20180326070330/${url}`);
  });

  it("Throws error getting syndicated URL with no API keys", async () => {
    const internetArchiveNoKeys = new InternetArchiveSyndicatorPlugin({});

    await assert.rejects(internetArchiveNoKeys.syndicate({ url }), {
      code: "indiekit",
      message:
        "Internet Archive syndicator: You need to be logged in to use Save Page Now.",
      name: "IndiekitError",
    });
  });
});
