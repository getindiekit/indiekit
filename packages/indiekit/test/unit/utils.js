import { strict as assert } from "node:assert";
import { randomBytes } from "node:crypto";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { decrypt, encrypt, getPackageData } from "../../lib/utils.js";

const iv = randomBytes(16);

describe("indiekit/lib/utils", () => {
  it("Encrypts and decrypts a string", () => {
    const encryptedResult = encrypt("foo", iv);
    assert.match(encryptedResult, /[\dA-Fa-f]+/);
    assert.equal(decrypt(encryptedResult, iv), "foo");
  });

  it("Gets package JSON object", () => {
    const filePath = fileURLToPath(
      new URL("../../../../packages/preset-hugo", import.meta.url),
    );
    const result = getPackageData(filePath);
    assert.equal(result.description, "Hugo publication preset for Indiekit");
  });

  it("Returns empty object getting unknown package JSON", () => {
    const filePath = fileURLToPath(
      new URL("../../../../packages/foobar", import.meta.url),
    );
    const result = getPackageData(filePath);
    assert.deepEqual(result, {});
  });
});
