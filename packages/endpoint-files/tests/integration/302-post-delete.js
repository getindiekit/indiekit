import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

await mockAgent("endpoint-media");

test.failing("Deletes file and redirects to files page", async (t) => {
  // Upload file
  const server = await testServer();
  const request = supertest.agent(server);
  const uploadResponse = await request
    .post("/files/upload")
    .set("cookie", [cookie()])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  const dom = new JSDOM(uploadResponse.text);
  const url = dom.window.document.querySelector(
    ".notification__text a"
  ).textContent;

  // Delete file
  const id = Buffer.from(url).toString("base64url");
  const result = await request
    .post(`/files/${id}/delete`)
    .set("cookie", [cookie()])
    .send({ url });

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/files\?success/);

  server.close(t);
});
