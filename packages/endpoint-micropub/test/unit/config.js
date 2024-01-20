import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { testConfig } from "@indiekit-test/config";
import MastodonSyndicator from "@indiekit/syndicator-mastodon";
import { getConfig, queryConfig } from "../../lib/config.js";

const config = await testConfig({ usePostTypes: true });
const list = ["blog", "indieweb", "microblog", "web", "website"];

describe("endpoint-micropub/lib/config", () => {
  it("Returns queryable config", () => {
    const application = {
      url: "https://endpoint.example",
    };
    const mastodon = new MastodonSyndicator({
      checked: true,
      url: "https://mastodon.example",
      user: "username",
    });
    const publication = {
      categories: ["foo", "bar"],
      postTypes: config.publication.postTypes,
      syndicationTargets: [mastodon],
    };
    const result = getConfig(application, publication);

    assert.deepEqual(result.categories, ["foo", "bar"]);
    assert.equal(result["post-types"][0].path, undefined);
    assert.equal(result["syndicate-to"][0].checked, true);
    assert.equal(result["syndicate-to"][0].service.name, "Mastodon");
    assert.equal(result["syndicate-to"][0].user.name, "@username");
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
