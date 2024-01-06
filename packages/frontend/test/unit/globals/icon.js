import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { icon } from "../../../lib/globals/index.js";

describe("frontend/lib/globals/icon", () => {
  it("Renders SVG icon", () => {
    const result = icon("note");

    assert.equal(result.includes(`<svg class="icon"`), true);
    assert.equal(
      result.includes(
        `M12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm24-4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 14h24v4H12v-4zm0 8h24v4H12v-4zm0 8h18v4H12v-4z`,
      ),
      true,
    );
  });

  it("Renders SVG icon with title", () => {
    const result = icon("note", "Note");

    assert.equal(result.includes(`<title id="note-title">Note</title>`), true);
  });

  it("Returns undefined if unknown SVG icon name", () => {
    assert.equal(icon("foo"), undefined);
  });
});
