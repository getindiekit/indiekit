import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Returns 400 if unable to grant token", async (t) => {
  nock("https://indieauth.com").post("/auth").replyWithError("Not found");

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
