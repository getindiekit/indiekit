import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import MastodonSyndicator from "@indiekit/syndicator-mastodon";
import { testApplication } from "@indiekit-test/application";
import { testConfig } from "@indiekit-test/config";
import { testPublication } from "@indiekit-test/publication";

import { getConfig, queryConfig } from "../../lib/config.js";

const config = await testConfig();
// Test post types are configured, but don’t yet have the `type` Indiekit adds
const postTypes = /** @type {Record<string, IndiekitPostType>} */ (
  config.publication?.postTypes
);
const list = ["blog", "indieweb", "microblog", "web", "website"];

describe("endpoint-micropub/lib/config", () => {
  it("Returns queryable config", () => {
    const application = testApplication({ url: "https://endpoint.example" });
    const mastodon = new MastodonSyndicator({
      checked: true,
      url: "https://mastodon.example",
      user: "username",
    });
    const publication = testPublication({
      categories: ["foo", "bar"],
      postTypes,
      syndicationTargets: [mastodon],
    });
    const result = getConfig(application, publication);

    assert.deepEqual(result.categories, ["foo", "bar"]);
    assert.equal(Object.hasOwn(result["post-types"][0], "path"), false);
    assert.equal(result["syndicate-to"][0].checked, true);
    assert.equal(result["syndicate-to"][0].service.name, "Mastodon");
    assert.equal(result["syndicate-to"][0].user?.name, "@username");
  });

  it("Omits syndication target whose info can’t be read", () => {
    const application = testApplication({ url: "https://endpoint.example" });
    const mastodon = new MastodonSyndicator({
      url: "https://mastodon.example",
      user: "username",
    });
    // A syndicator whose configuration is invalid
    const broken = new (class extends MastodonSyndicator {
      /**
       * @returns {never} Never returns, as `info` can’t be read
       */
      get info() {
        throw new Error("Valid server URL required");
      }
    })();
    const publication = testPublication({
      postTypes,
      syndicationTargets: [broken, mastodon],
    });
    const result = getConfig(application, publication);

    assert.equal(result["syndicate-to"].length, 1);
    assert.equal(result["syndicate-to"][0].service.name, "Mastodon");
  });

  it("Filters a list", () => {
    const result = queryConfig(list, { filter: "web" });

    assert.deepEqual(result, ["indieweb", "web", "website"]);
  });

  it("Limits a list", () => {
    const result = queryConfig(list, { limit: 1 });

    assert.deepEqual(result, ["blog"]);
  });

  it("Limits a list with an offset", () => {
    const result = queryConfig(list, { limit: 1, offset: 2 });

    assert.deepEqual(result, ["microblog"]);
  });

  it("Filters and limits a list", () => {
    const result = queryConfig(list, { filter: "web", limit: 1 });

    assert.deepEqual(result, ["indieweb"]);
  });

  it("Filters and limits a list with an offset", () => {
    const result = queryConfig(list, {
      filter: "web",
      limit: 1,
      offset: 2,
    });

    assert.deepEqual(result, ["website"]);
  });
});
