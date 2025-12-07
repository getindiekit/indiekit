import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  getDockerComposeFileContent,
  getDockerEnvironment,
  getDockerEnvironmentFileContent,
} from "../../lib/docker.js";

describe("create-indiekit/lib/docker", () => {
  it("Gets Docker Compose file contents", async () => {
    const result = await getDockerComposeFileContent(["FOO", "BAR"]);

    assert.equal(result.includes("name: indiekit"), true);
    assert.match(result, /- FOO\n/);
    assert.match(result, /- BAR\n/);
  });

  it("Gets environment file contents", async () => {
    const result = await getDockerEnvironmentFileContent(["FOO", "BAR"]);

    assert.equal(result.includes(`MONGO_INITDB_ROOT_USERNAME='admin'`), true);
    assert.equal(result.includes(`MONGO_INITDB_ROOT_PASSWORD='`), true);
    assert.equal(result.includes(`SECRET='`), true);
    assert.equal(result.includes(`# PASSWORD_SECRET='<REQUIRED>'`), true);
    assert.equal(result.includes(`# FOO='<REQUIRED>'`), true);
    assert.equal(result.includes(`# BAR='<REQUIRED>'`), true);
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
