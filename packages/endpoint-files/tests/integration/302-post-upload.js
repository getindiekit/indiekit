import test from "ava";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

await mockAgent("endpoint-media");

test.failing("Uploads file and redirects to files page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/files/upload")
    .set("cookie", [cookie()])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 302);
  t.regex(result.text, /Found. Redirecting to \/files\?success/);

  server.close(t);
});
