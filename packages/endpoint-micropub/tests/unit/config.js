import test from "ava";
import JekyllPreset from "@indiekit/preset-jekyll";
import MastodonSyndicator from "@indiekit/syndicator-mastodon";
import { getConfig, queryConfig } from "../../lib/config.js";

test.beforeEach((t) => {
  t.context = {
    list: ["blog", "indieweb", "microblog", "web", "website"],
    url: "https://website.example",
  };
});

test("Returns queryable config", (t) => {
  const application = {
    url: "https://endpoint.example",
  };
  const twitter = new MastodonSyndicator({
    checked: true,
    url: "https://mastodon.example",
    user: "username",
  });
  const publication = {
    categories: ["foo", "bar"],
    postTypes: new JekyllPreset().postTypes,
    syndicationTargets: [twitter],
  };
  const result = getConfig(application, publication);

  t.deepEqual(result.categories, ["foo", "bar"]);
  t.falsy(result["post-types"][0].path);
  t.true(result["syndicate-to"][0].checked);
  t.is(result["syndicate-to"][0].service.name, "Mastodon");
  t.is(result["syndicate-to"][0].user.name, "@username");
});

test("Filters a list", (t) => {
  const result = queryConfig(t.context.list, { filter: "web" });

  t.deepEqual(result, ["indieweb", "web", "website"]);
});

test("Limits a list", (t) => {
  const result = queryConfig(t.context.list, { limit: 1 });

  t.deepEqual(result, ["blog"]);
});

test("Limits a list with an offset", (t) => {
  const result = queryConfig(t.context.list, { limit: 1, offset: 2 });

  t.deepEqual(result, ["microblog"]);
});

test("Filters and limits a list", (t) => {
  const result = queryConfig(t.context.list, { filter: "web", limit: 1 });

  t.deepEqual(result, ["indieweb"]);
});

test("Filters and limits a list with an offset", (t) => {
  const result = queryConfig(t.context.list, {
    filter: "web",
    limit: 1,
    offset: 2,
  });

  t.deepEqual(result, ["website"]);
});
