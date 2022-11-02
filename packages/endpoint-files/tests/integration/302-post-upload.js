import test from "ava";
import supertest from "supertest";
import { setGlobalDispatcher } from "undici";
import { storeAgent } from "@indiekit-test/mock-agent";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

setGlobalDispatcher(storeAgent());

test.failing("Uploads file and redirects to files page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/files/new")
    .set("cookie", [cookie])
    .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

  t.is(result.status, 302);

  server.close(t);
});
