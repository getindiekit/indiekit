import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 501 error unsupported post type", async (t) => {
  const server = await testServer({ usePreset: false });
  const request = supertest.agent(server);
  const result = await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
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
    "https://getindiekit.com/configuration/post-types"
  );

  server.close(t);
});
