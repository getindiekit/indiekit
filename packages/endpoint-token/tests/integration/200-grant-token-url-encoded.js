import process from "node:process";
import test from "ava";
import { setGlobalDispatcher } from "undici";
import { indieauthAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(indieauthAgent());

test("Grants token and returns JSON", async (t) => {
  const request = await testServer();
  const response = await request
    .post("/token")
    .send({ client_id: "https://client.example" })
    .send({ code: "123456" })
    .send({ redirect_uri: "/" });

  const responseTextRegexp =
    /access_token=(?<access_token>.*)&me=(?<me>.*)&scope=(?<scope>.*)/;
  const result = response.text.match(responseTextRegexp).groups;

  t.is(response.status, 200);
  t.truthy(result.access_token);
  t.is(result.me, encodeURIComponent(process.env.TEST_PUBLICATION_URL));
  t.truthy(result.scope);
});
