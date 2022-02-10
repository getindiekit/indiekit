import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns login page", async (t) => {
  const request = await testServer();

  const result = await request.get("/session/login");

  t.is(result.headers["x-robots-tag"], "noindex");
  t.is(result.statusCode, 200);
  t.is(result.type, "text/html");
});
