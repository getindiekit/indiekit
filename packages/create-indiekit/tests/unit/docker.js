import test from "ava";
import {
  getDockerComposeFileContent,
  getDockerEnvironment,
} from "../../lib/docker.js";

test("Gets Docker Compose file contents", async (t) => {
  const result = await getDockerComposeFileContent(["FOO", "BAR"]);

  t.true(result.includes('version: "3.9"'));
  t.regex(result, /- FOO\n/);
  t.regex(result, /- BAR\n/);
});

test("Gets environment variables required by plug-ins", async (t) => {
  const setup = {
    storePlugin: "@indiekit-test/store", // Plug-in with no environment
    syndicatorPlugins: [
      "@indiekit/syndicator-internet-archive",
      "@indiekit/syndicator-mastodon",
    ],
  };

  const result = await getDockerEnvironment(setup);

  t.deepEqual(result, [
    "INTERNET_ARCHIVE_ACCESS_KEY",
    "INTERNET_ARCHIVE_SECRET_KEY",
    "MASTODON_ACCESS_TOKEN",
  ]);
});
