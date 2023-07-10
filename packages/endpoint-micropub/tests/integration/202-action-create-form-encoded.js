import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");

test("Creates post (form-encoded)", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=Foobar")
    .send("content=Micropub+test+of+creating+an+h-entry+with+categories")
    .send("photo=https%3A%2F%2Fwebsite.example%2Fphoto.jpg")
    .send("category[]=test1&category[]=test2");

  t.is(result.status, 202);
  t.regex(result.headers.location, /\bfoobar\b/);
  t.regex(result.body.success_description, /\bPost will be created\b/);

  server.close(t);
});
