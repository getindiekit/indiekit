import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 if malformed token provided", async (t) => {
  const request = await testServer();
  const result = await request
    .get("/token")
    .auth("foobar", { type: "bearer" })
    .set("Accept", "application/json");

  t.is(result.status, 401);
  t.is(result.body.error_description, "JSON Web Token error: jwt malformed");
});
