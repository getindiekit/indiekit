import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns JavaScript", async (t) => {
  const request = await testServer();

  const result = await request.get("/assets/app.js");

  t.is(result.status, 200);
  t.is(result.type, "text/javascript");
});
