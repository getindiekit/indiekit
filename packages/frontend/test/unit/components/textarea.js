import { strict as assert } from "node:assert";
import { before, describe, it } from "node:test";

import { JSDOM } from "jsdom";

// CodeMirror reads the user agent once, when it is imported. On a mobile one
// it edits through a contenteditable element, so `.CodeMirror` has no textarea
const { window } = new JSDOM("<!doctype html><body></body>", {
  pretendToBeVisual: true,
});
Object.defineProperty(window.navigator, "userAgent", {
  value:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36",
});
for (const name of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "customElements",
  "getComputedStyle",
  "requestAnimationFrame",
]) {
  Object.defineProperty(globalThis, name, {
    value: name === "window" ? window : window[name],
    configurable: true,
  });
}

// jsdom has no layout, so nothing to observe, and the spell checker fetches
// its dictionaries, so keep the test offline
const stubs = {
  ResizeObserver: class {
    observe() {}
  },
  XMLHttpRequest: class {
    open() {}
    send() {}
  },
};
for (const [name, value] of Object.entries(stubs)) {
  Object.defineProperty(globalThis, name, { value, configurable: true });
}

describe("frontend/components/textarea", () => {
  before(async () => {
    const { TextareaFieldComponent } =
      await import("../../../components/textarea/index.js");
    customElements.define("textarea-field", TextareaFieldComponent);
  });

  it("Adds toolbar icons when CodeMirror edits without a textarea", () => {
    document.body.innerHTML = `
      <textarea-field editor editor-id="content" editor-locale="en">
        <label class="label" for="content">Content</label>
        <textarea class="textarea" id="content" name="content"></textarea>
      </textarea-field>
    `;
    const element = document.querySelector("textarea-field");
    assert.ok(element);

    assert.equal(element.querySelectorAll(".CodeMirror textarea").length, 0);
    const $$buttons = element.querySelectorAll(".editor-toolbar button");
    assert.ok($$buttons.length > 0);
    for (const $button of $$buttons) {
      assert.ok($button.querySelector("svg"), $button.className);
    }
  });
});
