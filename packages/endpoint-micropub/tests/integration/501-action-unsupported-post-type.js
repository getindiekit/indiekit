import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 501 error unsupported post type", async (t) => {
  const request = await testServer({
    usePreset: false,
  });

  // Create post
  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .send({
      type: ["h-entry"],
      properties: {
        name: ["Foobar"],
        content: ["I ate a cheese sandwich, which was nice."],
      },
    });

  t.is(result.status, 501);
  t.is(
    result.body.error_description,
    "No configuration provided for article post type"
  );
  t.is(
    result.body.error_uri,
    "https://getindiekit.com/customisation/post-types/"
  );
});
