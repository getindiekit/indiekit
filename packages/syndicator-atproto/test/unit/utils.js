import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { uriToPostUrl } from "../../lib/utils.js";

describe("syndicator-atproto/lib/utils", () => {
  it("Converts AT Protocol URI to post URL", () => {
    const result = uriToPostUrl(
      "https://butterfly.app/profile",
      "at://did:plc:ix4srp5t7rswkoachemlkzdt/app.bsky.feed.post/3llped5ya3b22",
    );

    assert.equal(
      result,
      "https://butterfly.app/profile/did:plc:ix4srp5t7rswkoachemlkzdt/post/3llped5ya3b22",
    );
  });
});
