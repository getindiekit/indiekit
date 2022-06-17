import test from "ava";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error no `code`", async (t) => {
  const request = await testServer();
  const result = await request
    .post("/token")
    .set("accept", "application/json")
    .send({ client_id: "https://server.example" })
    .send({ redirect_uri: "/" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing code");
});
