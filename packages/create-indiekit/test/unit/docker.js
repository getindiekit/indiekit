import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  getDockerComposeFileContent,
  getDockerEnvironment,
} from "../../lib/docker.js";

describe("create-indiekit/lib/docker", () => {
  it("Gets Docker Compose file contents", async () => {
    const result = await getDockerComposeFileContent(["FOO", "BAR"]);

    assert.equal(result.includes('version: "3.9"'), true);
    assert.match(result, /- FOO\n/);
    assert.match(result, /- BAR\n/);
  });

  it("Gets environment variables required by plug-ins", async () => {
    const setup = {
      storePlugin: "@indiekit-test/store", // Plug-in with no environment
      syndicatorPlugins: [
        "@indiekit/syndicator-internet-archive",
        "@indiekit/syndicator-mastodon",
      ],
    };

    const result = await getDockerEnvironment(setup);

    assert.deepEqual(result, [
      "INTERNET_ARCHIVE_ACCESS_KEY",
      "INTERNET_ARCHIVE_SECRET_KEY",
      "MASTODON_ACCESS_TOKEN",
    ]);
  });
});
