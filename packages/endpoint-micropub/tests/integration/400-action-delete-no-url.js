import process from "node:process";
import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 deleting post without a URL", async (t) => {
  const request = await testServer();

  // Delete post
  const result = await request
    .post("/micropub")
    .accept("application/json")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      action: "delete",
    });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `url`");
});
