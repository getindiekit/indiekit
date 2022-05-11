import test from "ava";
import { setGlobalDispatcher } from "undici";
import { indieauthAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(indieauthAgent());

test("Returns 400 if unable to grant token", async (t) => {
  const request = await testServer();
  const result = await request
    .post("/token")
    .set("Accept", "application/json")
    .query({ code: "foo" })
    .query({ redirect_uri: "/" })
    .query({ client_id: "https://client.example" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Not found");
});
