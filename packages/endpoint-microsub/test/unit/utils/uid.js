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

    it("Uses only lowercase letters and digits", () => {
      for (let index = 0; index < 100; index++) {
        assert.match(generateChannelUid(), /^[a-z0-9]{24}$/);
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
