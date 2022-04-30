import crypto from "node:crypto";
import test from "ava";
import nock from "nock";
import { getFixture } from "@indiekit-test/get-fixture";
import { decrypt, encrypt, isUrl } from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context = {
    iv: crypto.randomBytes(16),
    url: "https://website.example/home.html",
  };
});

test("Encrypts and decrypts a string", (t) => {
  const encryptedResult = encrypt("foo", t.context.iv);
  t.regex(encryptedResult, /[\da-fA-F]+/);
  t.is(decrypt(encryptedResult, t.context.iv), "foo");
});

test("Checks if given string is a valid URL", (t) => {
  t.false(isUrl("foo.bar"));
  t.true(isUrl("https://foo.bar"));
});

test("Throws error if given URL is not a string", (t) => {
  t.throws(
    () => {
      isUrl({ url: "https://foo.bar" });
    },
    {
      instanceOf: TypeError,
      message: "Expected a string",
    }
  );
});
