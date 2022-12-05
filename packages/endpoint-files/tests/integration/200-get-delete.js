import { Buffer } from "node:buffer";
import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Gets delete confirmation page", async (t) => {
  const url = "https://example.website/photo.jpg";
  const id = Buffer.from(url).toString("base64url");

  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get(`/files/${id}/delete`)
    .set("cookie", [cookie()]);
  const dom = new JSDOM(response.text);
  const result = dom.window.document.querySelector("title").textContent;

  t.is(
    result,
    "Are you sure you want to delete this file? - Test configuration"
  );

  server.close(t);
});
