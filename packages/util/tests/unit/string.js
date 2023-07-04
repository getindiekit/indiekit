import { Buffer } from "node:buffer";
import test from "ava";
import { randomString, slugify, supplant } from "../../lib/string.js";

test("Generates cryptographically random string", (t) => {
  const result = randomString(8);

  t.is(result.length, 8);
  t.true(Buffer.from(result, "base64url").toString("base64url") === result);
});

test("Slugifies a string", (t) => {
  t.is(slugify("Foo bar baz", "_"), "foo_bar_baz");
  t.is(slugify("McLaren's Lando Norris"), "mclarens-lando-norris");
  t.is(slugify("McLaren’s Lando Norris"), "mclarens-lando-norris");
});

test("Substitutes variables enclosed in { } braces with data from object", (t) => {
  const string = "{array} {string} {number}";
  const object = {
    array: ["Array"],
    string: "string",
    number: 1,
  };
  const result = supplant(string, object);

  t.is(result, "{array} string 1");
});
