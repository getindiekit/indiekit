import test from "ava";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns 404 if can’t find previously uploaded file", async (t) => {
  const request = await testServer();
  const result = await request
    .get("/files/5ffcc8025c561a7bf53bd6e8")
    .set("cookie", [cookie]);

  t.is(result.status, 404);
  t.true(result.text.includes("No file was found at this URL"));
});
