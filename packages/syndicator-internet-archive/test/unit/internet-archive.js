import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import { InternetArchive } from "../../lib/internet-archive.js";

await mockAgent("syndicator-internet-archive");

describe("syndicator-internet-archive/lib/internet-archive", async () => {
  const internetArchive = new InternetArchive({
    accessKey: "token",
    secretKey: "secret",
  });
  const job_id = "ac58789b-f3ca-48d0-9ea6-1d1225e98695";
  const url = "http://website.example/post/1";

  it("Makes capture request", async () => {
    const result = await internetArchive.capture(url);

    assert.deepEqual(result, { job_id, url });
  });

  it("Throws error making capture request", async () => {
    await assert.rejects(new InternetArchive({}).capture(url), {
      message: "You need to be logged in to use Save Page Now.",
    });
  });

  it("Makes status request", async () => {
    const result = await internetArchive.status(job_id);

    assert.deepEqual(result, {
      status: "success",
      original_url: url,
      timestamp: "20180326070330",
    });
  });

  it("Throws error message from status request", async () => {
    await assert.rejects(internetArchive.status("foobar"), {
      message: `Couldn't resolve host for ${url}`,
    });
  });

  it("Throws error making status request", async () => {
    await assert.rejects(new InternetArchive({}).status(job_id), {
      message: "You need to be logged in to use Save Page Now.",
    });
  });
});
