import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";
import { describe, it } from "node:test";
import { randomString, slugify, supplant } from "../../lib/string.js";

describe("util/lib/string", () => {
  it("Generates cryptographically random string", () => {
    const result = randomString(8);

    assert.equal(result.length, 8);
    assert.equal(
      Buffer.from(result, "base64url").toString("base64url") === result,
      true,
    );
  });

  it("Slugifies a string", () => {
    assert.equal(slugify("Foo bar baz", { separator: "_" }), "foo_bar_baz");
    assert.equal(slugify("McLaren's Lando Norris"), "mclarens-lando-norris");
    assert.equal(slugify("McLaren’s Lando Norris"), "mclarens-lando-norris");
  });

  it("Substitutes variables enclosed in braces with data from object", () => {
    const string = "{array} {string} {number}";
    const object = {
      array: ["Array"],
      string: "string",
      number: 1,
    };
    const result = supplant(string, object);

    assert.equal(result, "{array} string 1");
  });
});
