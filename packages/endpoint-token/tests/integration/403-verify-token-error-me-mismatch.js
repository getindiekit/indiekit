import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 403 if publication URL doesn’t match URL in token", async (t) => {
  const request = await testServer({
    publication: {
      me: 'https://server.example'
    }
  });
  const result = await request
    .get("/token")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json");

  t.is(result.status, 403);
  t.is(result.body.error_description, "Publication URL does not match that provided by access token");
});
