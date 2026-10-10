import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { uuidv7At } from "../../lib/uid.js";

describe("util/lib/uid", () => {
  it("Encodes the given time in the first 48 bits", () => {
    const uid = uuidv7At(Date.UTC(2026, 0, 2));

    assert.match(
      uid,
      /^[\da-f]{8}-[\da-f]{4}-7[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/,
    );
    const milliseconds = Number.parseInt(uid.slice(0, 13).replace("-", ""), 16);
    assert.equal(milliseconds, Date.UTC(2026, 0, 2));
  });

  it("Sorts by the given time", () => {
    assert.ok(uuidv7At(Date.UTC(2026, 0, 1)) < uuidv7At(Date.UTC(2026, 0, 2)));
  });

  it("Keeps the given sequence within a millisecond", () => {
    const first = uuidv7At(Date.UTC(2026, 0, 1), 1);
    const second = uuidv7At(Date.UTC(2026, 0, 1), 2);

    assert.ok(first < second);
    assert.equal(first.slice(14, 18), "7001");
  });

  it("Differs between two calls for the same millisecond", () => {
    assert.notEqual(
      uuidv7At(Date.UTC(2026, 0, 1)),
      uuidv7At(Date.UTC(2026, 0, 1)),
    );
  });
});
