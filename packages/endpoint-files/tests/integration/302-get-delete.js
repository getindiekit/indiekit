import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Redirects to file page if no delete permissions", async (t) => {
  const url = "https://example.website/photo.jpg";
  const id = Buffer.from(url).toString("base64url");

  const scopedCookie = cookie({ scope: "update" });
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get(`/files/${id}/delete`)
    .set("cookie", [scopedCookie]);

  t.is(result.status, 302);

  server.close(t);
});
