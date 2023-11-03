import test from "ava";
import { testDatabase } from "@indiekit-test/database";
import {
  getPostData,
  getSyndicationTarget,
  hasSyndicationUrl,
} from "../../lib/utils.js";

const posts = await testDatabase("posts");

test.beforeEach((t) => {
  t.context = {
    application: {
      posts,
      useDatabase: true,
    },
    url: "https://website.example/post/12345",
  };

  posts.insertOne({
    properties: {
      type: "entry",
      "mp-syndicate-to": "https://mastodon.example/",
      url: t.context.url,
    },
  });
});

test("Gets post for given URL from database", async (t) => {
  const result = await getPostData(t.context.application, t.context.url);

  t.is(result.properties["mp-syndicate-to"], "https://mastodon.example/");
});

test("Gets post data from database", async (t) => {
  const result = await getPostData(t.context.application);

  t.is(result.properties["mp-syndicate-to"], "https://mastodon.example/");
});

test("Gets syndication target for syndication URL", (t) => {
  const targets = [{ info: { uid: "https://mastodon.example" } }];
  const result = getSyndicationTarget(targets, "https://mastodon.example");

  t.is(result.info.uid, "https://mastodon.example");
});

test("Returns undefined getting unknown target for syndication URL", (t) => {
  const targets = [{ info: { uid: "https://mastodon.example" } }];
  const result = getSyndicationTarget(targets, "https://mastodon.foo");

  t.falsy(result);
});

test("Returns undefined if no target URLs defined for syndication URL", (t) => {
  const targets = [{ info: { name: "Example" } }];
  const result = getSyndicationTarget(targets, "https://mastodon.example");

  t.falsy(result);
});

test("Checks if target already returned a syndication URL", (t) => {
  const syndication = [
    "https://mastodon.example/@username/67890",
    "https://web.archive.org/web/20230116193035/https://example.com/",
  ];

  t.true(hasSyndicationUrl(syndication, "https://mastodon.example"));
  t.true(hasSyndicationUrl(syndication, "https://web.archive.org"));
  t.false(hasSyndicationUrl(syndication, "https://mastodon.foo"));
});
