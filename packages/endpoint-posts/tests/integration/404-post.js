import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 404 error if can’t find previously published post", async (t) => {
  const request = await testServer();

  const result = await request
    .get("/posts/5ffcc8025c561a7bf53bd6e8")
    .auth(process.env.TEST_TOKEN, { type: "bearer" });

  t.is(result.status, 404);
  t.true(result.text.includes("No post was found at this URL"));
});
