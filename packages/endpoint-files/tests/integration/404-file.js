import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

test("Returns 404 error file not found", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/files/404").set("cookie", [testCookie()]);

  t.is(result.status, 404);
  t.true(
    result.text.includes(
      "If you entered a web address please check it was correct",
    ),
  );

  server.close(t);
});
