import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns 404 error deleting file with no record", async (t) => {
  const url = "https://example.website/photo.jpg";
  const id = Buffer.from(url).toString("base64url");

  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post(`/files/${id}/delete`)
    .set("cookie", [cookie()])
    .send({ url });

  t.is(result.status, 404);
  t.true(result.text.includes("No file was found at this URL"));

  server.close(t);
});
