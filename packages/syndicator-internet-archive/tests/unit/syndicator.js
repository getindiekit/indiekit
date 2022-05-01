import test from "ava";
import nock from "nock";
import { Indiekit } from "@indiekit/indiekit";
import { InternetArchiveSyndicator } from "../../index.js";

const internetArchive = new InternetArchiveSyndicator();

test.beforeEach((t) => {
  t.context = {
    job_id: "ac58789b-f3ca-48d0-9ea6-1d1225e98695",
    options: {
      accessKey: "0123456789abcdef",
      secret: "abcdef0123456789",
    },
    timestamp: "20180326070330",
    properties: {
      url: "http://website.example/post/1",
    },
  };
});

test("Gets plug-in info", (t) => {
  t.is(internetArchive.name, "Internet Archive syndicator");
  t.false(internetArchive.info.checked);
  t.is(internetArchive.info.name, "Internet Archive");
  t.is(internetArchive.info.uid, "https://web.archive.org/");
  t.truthy(internetArchive.info.service);
});

test("Initiates plug-in", (t) => {
  const indiekit = new Indiekit();
  internetArchive.init(indiekit);

  t.is(
    indiekit.publication.syndicationTargets[0].info.name,
    "Internet Archive"
  );
});

test("Returns syndicated URL", async (t) => {
  const { job_id, options, timestamp, properties } = t.context;
  nock("https://web.archive.org")
    .post("/save/")
    .reply(200, { url: properties.url, job_id });
  nock("https://web.archive.org")
    .get(`/save/status/${job_id}`)
    .reply(200, { status: "success", original_url: properties.url, timestamp });
  const syndicator = new InternetArchiveSyndicator(options);

  const result = await syndicator.syndicate(properties);

  t.is(result, `https://web.archive.org/web/20180326070330/${properties.url}`);
});

test("Throws error getting syndicated URL with no API keys", async (t) => {
  await t.throwsAsync(
    internetArchive.syndicate({ properties: t.context.url }),
    {
      message: "Cannot read properties of undefined (reading 'body')",
    }
  );
});
