import assert from "node:assert";
import { describe, it } from "node:test";
import SyndicatorIndienews from "../index.js";

describe("syndicator-indienews", () => {
  describe("info", () => {
    it("returns uid with default language", () => {
      const syndicator = new SyndicatorIndienews();
      assert.equal(syndicator.info.uid, "https://news.indieweb.org/en/");
    });

    it("returns uid with configured language", () => {
      const syndicator = new SyndicatorIndienews({ language: "es" });
      assert.equal(syndicator.info.uid, "https://news.indieweb.org/es/");
    });

    it("includes service info", () => {
      const syndicator = new SyndicatorIndienews();
      assert.equal(syndicator.info.service.name, "IndieNews");
      assert.equal(syndicator.info.service.url, "https://news.indieweb.org");
    });
  });

  describe("getSyndicationUrl", () => {
    it("returns the uid as syndication URL", async () => {
      const syndicator = new SyndicatorIndienews({ language: "en" });
      const result = await syndicator.getSyndicationUrl();
      assert.equal(result, "https://news.indieweb.org/en/");
    });

    it("returns correct URL for configured language", async () => {
      const syndicator = new SyndicatorIndienews({ language: "es" });
      const result = await syndicator.getSyndicationUrl();
      assert.equal(result, "https://news.indieweb.org/es/");
    });
  });

  describe("init", () => {
    it("registers syndicator with Indiekit", () => {
      const syndicator = new SyndicatorIndienews();
      const added = [];
      const mockIndiekit = { addSyndicator: (s) => added.push(s) };
      syndicator.init(mockIndiekit);
      assert.equal(added.length, 1);
      assert.equal(added[0], syndicator);
    });
  });
});
