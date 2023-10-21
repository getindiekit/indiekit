import test from "ava";
import { testDatabase } from "@indiekit-test/database";
import {
  getPostData,
  hasSyndicationUrl,
  isSyndicationTarget,
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

test("Checks if target already returned a syndication URL", (t) => {
  const syndicationUrls = [
    "https://web.archive.org/",
    "https://mastodon.example/@username/67890",
  ];

  t.true(hasSyndicationUrl(syndicationUrls, "https://mastodon.example"));
  t.false(hasSyndicationUrl(syndicationUrls, "https://mastodon.foo"));
});

test("Check if post target is a publication target", (t) => {
  const syndicationTargets = [
    {
      info: {
        uid: "https://mastodon.example",
      },
    },
  ];

  t.true(isSyndicationTarget(syndicationTargets, "https://mastodon.example"));
  t.false(isSyndicationTarget(syndicationTargets, "https://mastodon.foo"));
});
