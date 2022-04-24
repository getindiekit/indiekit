import process from "node:process";
import test from "ava";
import { setGlobalDispatcher } from "undici";
import { websiteAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

setGlobalDispatcher(websiteAgent());

test("Returns list of previously published posts", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .query("q=source&properties[]=name&url=https://website.example/page.html");

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, "Source has no items");
});
