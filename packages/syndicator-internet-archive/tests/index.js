import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import { Indiekit } from "@indiekit/indiekit";
import InternetArchiveSyndicator from "../index.js";

await mockAgent("syndicator-internet-archive");

const internetArchive = new InternetArchiveSyndicator({
  accessKey: "token",
  secret: "secret",
});

test.beforeEach((t) => {
  t.context = {
    url: "http://website.example/post/1",
  };
});

test("Gets plug-in info", (t) => {
  t.is(internetArchive.name, "Internet Archive syndicator");
  t.false(internetArchive.info.checked);
  t.is(internetArchive.info.name, "Internet Archive");
  t.is(internetArchive.info.uid, "https://web.archive.org/");
  t.truthy(internetArchive.info.service);
});

test("Initiates plug-in", async (t) => {
  const indiekit = await Indiekit.initialize();
  internetArchive.init(indiekit);

  t.is(
    indiekit.publication.syndicationTargets[0].info.name,
    "Internet Archive"
  );
});

test("Returns syndicated URL", async (t) => {
  const result = await internetArchive.syndicate({ url: t.context.url });

  t.is(result, `https://web.archive.org/web/20180326070330/${t.context.url}`);
});

test("Throws error getting syndicated URL with no API keys", async (t) => {
  const internetArchiveNoKeys = new InternetArchiveSyndicator({});

  await t.throwsAsync(internetArchiveNoKeys.syndicate({ url: t.context.url }), {
    code: "indiekit",
    message:
      "Internet Archive syndicator: You need to be logged in to use Save Page Now.",
    name: "IndiekitError",
  });
});
