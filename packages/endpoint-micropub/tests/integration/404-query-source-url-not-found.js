import test from "ava";
import { setGlobalDispatcher } from "undici";
import { tokenEndpointAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(tokenEndpointAgent());

test("Returns 404 if source URL can’t be found", async (t) => {
  const request = await testServer({
    publication: {
      me: "https://website.example",
      tokenEndpoint: "https://token-endpoint.example",
    },
  });

  const result = await request
    .get("/micropub")
    .auth("JWT", { type: "bearer" })
    .set("accept", "application/json")
    .query("q=source&properties[]=name&url=https://website.example/404.html");

  t.is(result.statusCode, 404);
  t.is(result.body.error_description, "Not Found");
});
