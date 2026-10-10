import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { generateChannelUid, uuidv7At } from "../../../lib/utils/uid.js";

describe("endpoint-microsub/lib/utils/uid", () => {
  describe("uuidv7At", () => {
    it("Encodes the given time in the first 48 bits", () => {
      const uid = uuidv7At(new Date("2026-01-02T00:00:00.000Z"));

      assert.match(
        uid,
        /^[\da-f]{8}-[\da-f]{4}-7[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/,
      );
      const milliseconds = Number.parseInt(
        uid.slice(0, 13).replace("-", ""),
        16,
      );
      assert.equal(milliseconds, Date.UTC(2026, 0, 2));
    });

    it("Sorts by the given time, newest last", () => {
      const earlier = uuidv7At(new Date(Date.UTC(2026, 0, 1)));
      const later = uuidv7At(new Date(Date.UTC(2026, 0, 2)));

      assert.ok(earlier < later);
    });

    it("Differs between two items published in the same millisecond", () => {
      const when = new Date(Date.UTC(2026, 0, 1));

      assert.notEqual(uuidv7At(when), uuidv7At(when));
    });
  });

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
