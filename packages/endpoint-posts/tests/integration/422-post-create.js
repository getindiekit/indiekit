import test from "ava";
import supertest from "supertest";
import { JSDOM } from "jsdom";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Returns 422 error invalid form submission", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/posts/create")
    .set("cookie", [cookie()])
    .send({ type: "entry" })
    .send({ "post-type": "note" });
  const dom = new JSDOM(response.text);
  const result = dom.window.document;

  t.is(response.status, 422);
  t.is(
    result.querySelector("title").textContent,
    "Error: Create a new custom note post type post - Test configuration"
  );
  t.is(
    result.querySelector("#content-error .error-message__text").textContent,
    "Enter some content"
  );

  server.close(t);
});
