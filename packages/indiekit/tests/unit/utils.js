import crypto from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "ava";
import { decrypt, encrypt, getPackageData } from "../../lib/utils.js";

test.beforeEach((t) => {
  t.context = {
    iv: crypto.randomBytes(16),
    url: "https://website.example/home.html",
  };
});

test("Encrypts and decrypts a string", (t) => {
  const encryptedResult = encrypt("foo", t.context.iv);
  t.regex(encryptedResult, /[\dA-Fa-f]+/);
  t.is(decrypt(encryptedResult, t.context.iv), "foo");
});

test("Gets package JSON object", (t) => {
  const url = pathToFileURL(path.resolve("packages/preset-hugo/index.js"));
  const result = getPackageData(url);
  t.is(result.description, "Hugo publication preset for Indiekit");
});

test("Returns empty object getting unknown package JSON", (t) => {
  const url = pathToFileURL(path.resolve("packages/foobar/index.js"));
  const result = getPackageData(url);
  t.deepEqual(result, {});
});
