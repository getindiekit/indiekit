import assert from "node:assert";
import { describe, it } from "node:test";
import SyndicatorIndieNews from "../index.js";

describe("syndicator-indienews", () => {
  describe("single language (default)", () => {
    const syndicator = new SyndicatorIndieNews();

    it("creates one target", () => {
      assert.equal(syndicator.targets.length, 1);
    });

    it("target uid defaults to english", () => {
      assert.equal(syndicator.targets[0].info.uid, "https://news.indieweb.org/en/");
    });

    it("target checked defaults to false", () => {
      assert.equal(syndicator.targets[0].info.checked, false);
    });

    it("target includes service info", () => {
      assert.equal(syndicator.targets[0].info.service.name, "IndieNews");
      assert.equal(syndicator.targets[0].info.service.url, "https://news.indieweb.org");
    });
  });

  describe("single language (configured)", () => {
    const syndicator = new SyndicatorIndieNews({
      language: "es",
      checked: true,
    });

    it("creates one target with configured language", () => {
      assert.equal(syndicator.targets.length, 1);
      assert.equal(syndicator.targets[0].info.uid, "https://news.indieweb.org/es/");
    });

    it("respects checked option", () => {
      assert.equal(syndicator.targets[0].info.checked, true);
    });
  });

  describe("multiple languages", () => {
    const syndicator = new SyndicatorIndieNews([
      { language: "en" },
      { language: "es", checked: true },
    ]);

    it("creates one target per language", () => {
      assert.equal(syndicator.targets.length, 2);
    });

    it("first target is english", () => {
      assert.equal(syndicator.targets[0].info.uid, "https://news.indieweb.org/en/");
    });

    it("second target is spanish with checked", () => {
      assert.equal(syndicator.targets[1].info.uid, "https://news.indieweb.org/es/");
      assert.equal(syndicator.targets[1].info.checked, true);
    });
  });

  describe("getSyndicationUrl", () => {
    it("returns the uid for the configured language", async () => {
      const syndicator = new SyndicatorIndieNews({ language: "en" });
      const result = await syndicator.targets[0].getSyndicationUrl();
      assert.equal(result, "https://news.indieweb.org/en/");
    });

    it("each target returns its own uid", async () => {
      const syndicator = new SyndicatorIndieNews([
        { language: "en" },
        { language: "es" },
      ]);
      const [en, es] = await Promise.all(syndicator.targets.map((t) => t.getSyndicationUrl()));
      assert.equal(en, "https://news.indieweb.org/en/");
      assert.equal(es, "https://news.indieweb.org/es/");
    });
  });

  describe("init", () => {
    it("registers all targets with Indiekit", () => {
      const syndicator = new SyndicatorIndieNews([
        { language: "en" },
        { language: "es" },
      ]);
      const added = [];
      const mockIndiekit = { addSyndicator: (targets) => added.push(...targets) };
      syndicator.init(mockIndiekit);
      assert.equal(added.length, 2);
    });

    it("registers single target with Indiekit", () => {
      const syndicator = new SyndicatorIndieNews({ language: "en" });
      const added = [];
      const mockIndiekit = { addSyndicator: (targets) => added.push(...targets) };
      syndicator.init(mockIndiekit);
      assert.equal(added.length, 1);
    });
  });
});
