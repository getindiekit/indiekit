import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 404", async (t) => {
  const request = await testServer();

  const result = await request.get("/not-found");

  t.is(result.status, 404);
});
