import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { generateChannelUid } from "../../../lib/utils/uid.js";

describe("endpoint-microsub/lib/utils/uid", () => {
  describe("generateChannelUid", () => {
    it("Returns a 24-character string", () => {
      const uid = generateChannelUid();

      assert.equal(typeof uid, "string");
      assert.equal(uid.length, 24);
    });

    // A channel uid appears in Microsub request URLs, so it has to be
    // URL-safe. `randomString` returns base64url, which is.
    it("Uses only URL-safe characters", () => {
      for (let index = 0; index < 100; index++) {
        assert.match(generateChannelUid(), /^[\w-]{24}$/);
      }
    });

    it("Returns a different value on each call", () => {
      const uids = new Set();
      for (let index = 0; index < 100; index++) {
        uids.add(generateChannelUid());
      }

      assert.equal(uids.size, 100);
    });
  });
});
