import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Verifies token and returns URL encoded string", async (t) => {
  const request = await testServer();
  const response = await request
    .get("/token")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });

  const tokenUrlRegexp =
    /me=(?<me>.*)&client_id=(?<client_id>.*)&scope=(?<scope>.*)&date_issued=(?<date_issued>.*)&iat=(?<iat>.*)&exp=(?<exp>.*)/;
  const result = response.text.match(tokenUrlRegexp).groups;

  t.is(response.status, 200);
  t.truthy(result.client_id);
  t.is(result.me, encodeURIComponent(process.env.TEST_PUBLICATION_URL));
  t.truthy(result.scope);
});
