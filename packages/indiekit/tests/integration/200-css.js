import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns CSS", async (t) => {
  const request = await testServer();

  const result = await request.get("/assets/app.css");

  t.is(result.status, 200);
  t.is(result.type, "text/css");
});
