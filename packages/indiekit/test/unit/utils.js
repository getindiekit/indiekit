import { strict as assert } from "node:assert";
import crypto from "node:crypto";
import path from "node:path";
import { describe, it } from "node:test";
import { pathToFileURL } from "node:url";
import { decrypt, encrypt, getPackageData } from "../../lib/utils.js";

const iv = crypto.randomBytes(16);

describe("indiekit/lib/utils", () => {
  it("Encrypts and decrypts a string", () => {
    const encryptedResult = encrypt("foo", iv);
    assert.match(encryptedResult, /[\dA-Fa-f]+/);
    assert.equal(decrypt(encryptedResult, iv), "foo");
  });

  it("Gets package JSON object", () => {
    const url = pathToFileURL(path.resolve("packages/preset-hugo/index.js"));
    const result = getPackageData(url);
    assert.equal(result.description, "Hugo publication preset for Indiekit");
  });

  it("Returns empty object getting unknown package JSON", () => {
    const url = pathToFileURL(path.resolve("packages/foobar/index.js"));
    const result = getPackageData(url);
    assert.deepEqual(result, {});
  });
});
