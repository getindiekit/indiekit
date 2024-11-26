import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  languageName,
  languageNativeName,
} from "../../../lib/filters/index.js";

describe("frontend/lib/filters/locale", () => {
  it("Gets a language name", () => {
    assert.equal(languageName("fr"), "French");
  });

  it("Gets a language’s native name", () => {
    assert.equal(languageNativeName("fr"), "Français");
  });
});
