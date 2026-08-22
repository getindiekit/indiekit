import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { setupPrompts } from "../../lib/setup-prompts.js";
import { getPlugin } from "../../lib/utils.js";

describe("create-indiekit/lib/setup-prompts", () => {
  it("Gets plug-in installation prompts", () => {
    assert.equal(setupPrompts[0].message, "What is your website’s URL?");
  });

  it("Offers a content store that needs no credentials", async () => {
    const question = setupPrompts.find((p) => p.name === "storePlugin");
    const values = question.choices.map((choice) => choice.value);

    assert.ok(values.includes("@indiekit/store-file-system"));

    // Without this, every offered store requires an account and a token, so
    // there is no way to reach a working server from the wizard alone.
    const store = await getPlugin("@indiekit/store-file-system");
    assert.equal(store.environment, undefined);
  });

  it("Asks for a valid URL", () => {
    assert.equal(
      setupPrompts[0].validate("foo.bar"),
      "Enter a valid URL, for example https://website.example",
    );
    assert.equal(setupPrompts[0].validate("https://foo.bar"), true);
  });
});
