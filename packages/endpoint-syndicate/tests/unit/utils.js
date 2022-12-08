import test from "ava";
import { getPostData } from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context = {
    publication: {
      posts: {
        find: () => ({
          sort: () => ({
            limit: () => ({
              toArray: () => [
                {
                  properties: {
                    type: "entry",
                    "mp-syndicate-to": "https://social.example/",
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
            "mp-syndicate-to": "https://social.example/",
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
  const result = await getPostData(t.context.publication, t.context.url);

  t.is(result.properties["mp-syndicate-to"], "https://social.example/");
});

test("Gets post data from database", async (t) => {
  const result = await getPostData(t.context.publication);

  t.is(result.properties["mp-syndicate-to"], "https://social.example/");
});
