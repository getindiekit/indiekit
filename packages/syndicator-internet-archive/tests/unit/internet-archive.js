import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { internetArchive } from "../../lib/internet-archive.js";

await mockAgent("syndicator-internet-archive");

test.beforeEach((t) => {
  t.context = {
    job_id: "ac58789b-f3ca-48d0-9ea6-1d1225e98695",
    options: {
      accessKey: "token",
      secret: "secret",
    },
    url: "http://website.example/post/1",
  };
});

test("Makes capture request", async (t) => {
  const result = await internetArchive(t.context.options).capture(
    t.context.url
  );

  t.deepEqual(result, {
    job_id: t.context.job_id,
    url: t.context.url,
  });
});

test("Throws error making capture request", async (t) => {
  await t.throwsAsync(internetArchive({}).capture(t.context.url), {
    message: "You need to be logged in to use Save Page Now.",
  });
});

test("Makes status request", async (t) => {
  const result = await internetArchive(t.context.options).status(
    t.context.job_id
  );

  t.deepEqual(result, {
    status: "success",
    original_url: t.context.url,
    timestamp: "20180326070330",
  });
});

test("Throws error message from status request", async (t) => {
  await t.throwsAsync(internetArchive(t.context.options).status("foobar"), {
    message: `Couldn't resolve host for ${t.context.url}`,
  });
});

test("Throws error making status request", async (t) => {
  await t.throwsAsync(internetArchive({}).status(t.context.job_id), {
    message: "You need to be logged in to use Save Page Now.",
  });
});
