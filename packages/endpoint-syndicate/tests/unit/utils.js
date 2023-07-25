import test from "ava";
import {
  getPostData,
  hasSyndicationUrl,
  isSyndicationTarget,
} from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context = {
    application: {
      posts: {
        find: () => ({
          sort: () => ({
            limit: () => ({
              toArray: () => [
                {
                  properties: {
                    type: "entry",
                    "mp-syndicate-to": "https://mastodon.example/",
                    url: "https://website.example/notes/2020/10/17/12345",
                  },
                },
              ],
            }),
          }),
        }),
        findOne: () => ({
          properties: {
            type: "entry",
            "mp-syndicate-to": "https://mastodon.example/",
            url: "https://website.example/notes/2020/10/17/12345",
          },
        }),
        async insertOne() {},
        async replaceOne() {},
        async updateOne() {},
      },
    },
    url: "https://website.example/post/12345",
  };
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
