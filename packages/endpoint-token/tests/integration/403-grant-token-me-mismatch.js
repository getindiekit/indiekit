import test from "ava";
import { setGlobalDispatcher } from "undici";
import { indieauthAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(indieauthAgent());

test("Returns 403 if publication URL doesn’t match URL in token", async (t) => {
  const request = await testServer({
    publication: {
      me: "https://foo.bar",
    },
  });

  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .query({ client_id: "https://client.example" })
    .query({ code: "123456" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 403);
  t.is(
    result.body.error_description,
    "Publication URL does not match that provided by access token"
  );
});
