import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { setupPrompts } from "../../lib/setup-prompts.js";

describe("create-indiekit/lib/setup-prompts", () => {
  it("Gets plug-in installation prompts", () => {
    assert.equal(setupPrompts[0].message, "What is your website’s URL?");
  });

  it("Asks for a valid URL", () => {
    assert.equal(
      setupPrompts[0].validate("foo.bar"),
      "Enter a valid URL, for example, https://website.example",
    );
    assert.equal(setupPrompts[0].validate("https://foo.bar"), true);
  });
});
