import test from "ava";
import { setGlobalDispatcher } from "undici";
import { tokenEndpointAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(tokenEndpointAgent());

test("Returns list of previously published posts", async (t) => {
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
    .query("q=source&properties[]=name&url=https://website.example/page.html");

  t.is(result.statusCode, 200);
  t.is(result.text, "Source has no items");
  t.deepEqual(result.body, {});
});
