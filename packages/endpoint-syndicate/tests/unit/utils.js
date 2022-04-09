import process from "node:process";
import test from "ava";
import { getPostData } from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context.publication = {
    micropubEndpoint: "/micropub",
    posts: {
      find: () => ({
        toArray: async () => [
          {
            properties: {
              type: "entry",
              "mp-syndicate-to": "https://social.example/",
              url: `${process.env.TEST_PUBLICATION_URL}notes/2020/10/17/12345`,
            },
          },
        ],
      }),
      findOne: async () => ({
        properties: {
          type: "entry",
          name: "Item in database",
          published: "2020-10-17T19:41:39Z",
          url: `${process.env.TEST_PUBLICATION_URL}notes/2020/10/17/12345`,
          "mp-slug": "12345",
          "mp-syndicate-to": "https://social.example/",
        },
      }),
      async insertOne() {},
      async replaceOne() {},
      async updateOne() {},
    },
    url: "https://website.example/post/12345",
  };
});

test("Gets post for given URL from database", async (t) => {
  const result = await getPostData(t.context.publication, t.context.url);

  t.is(result.properties["mp-syndicate-to"], "https://social.example/");
});

test("Gets post data from database", async (t) => {
  const result = await getPostData(t.context.publication);

  t.is(result.properties["mp-syndicate-to"], "https://social.example/");
});
