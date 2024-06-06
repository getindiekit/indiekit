import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
// import { Indiekit } from "@indiekit/indiekit";
// import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import LinkedInSyndicator from "../index.js";

await mockAgent("syndicator-linkedin");

describe("syndicator-linkedin", () => {
  const linkedin = new LinkedInSyndicator({
    // accessToken: "token",
    // user: "username",
  });

  // const properties = JSON.parse(
  //   getFixture("jf2/article-content-provided-html-text.jf2"),
  // );

  // const publication = {
  //   me: "https://website.example",
  // };

  it("Gets plug-in environment", () => {
    assert.deepEqual(linkedin.environment, ["LINKEDIN_ACCESS_TOKEN"]);
  });
});
