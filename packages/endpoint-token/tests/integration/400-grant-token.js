import test from "ava";
import { setGlobalDispatcher } from "undici";
import { indieauthAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(indieauthAgent());

test("Returns 400 error unable to grant token", async (t) => {
  const request = await testServer();
  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .send({ client_id: "https://client.example" })
    .send({ code: "foobar" })
    .send({ redirect_uri: "/" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Invalid code");
});
