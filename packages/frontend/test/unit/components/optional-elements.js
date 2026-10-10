import { strict as assert } from "node:assert";
import { before, describe, it } from "node:test";

import { JSDOM } from "jsdom";

// Components are custom elements: give them a DOM before importing them
const { window } = new JSDOM("<!doctype html><body></body>");
for (const name of ["window", "document", "HTMLElement", "customElements"]) {
  Object.defineProperty(globalThis, name, {
    value: name === "window" ? window : window[name],
    configurable: true,
  });
}

// jsdom has no geolocation; geo-input bails out early without it
Object.defineProperty(window.navigator, "geolocation", { value: {} });
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
});

/**
 * Mount markup and return its first element, once connected
 * @param {string} html - Markup, as the component’s template renders it
 * @returns {Element} Mounted element
 */
const mount = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const element = template.content.firstElementChild;
  assert.ok(element);
  document.body.append(element);
  return element;
};

describe("frontend/components optional elements", () => {
  before(async () => {
    const { FileInputFieldController } =
      await import("../../../components/file-input/index.js");
    const { GeoInputFieldComponent } =
      await import("../../../components/geo-input/index.js");
    customElements.define("file-input-field", FileInputFieldController);
    customElements.define("geo-input-field", GeoInputFieldComponent);
  });

  it("Adds the file picker that only exists in its template", () => {
    const element = mount(`
      <file-input-field endpoint="/media">
        <input class="input file-input__path" id="photo">
        <progress class="file-input__progress" hidden></progress>
        <template id="file-input-picker">
          <div class="file-input__picker">
            <label class="file-input__button" for="photo-file" tabindex="0">Upload</label>
            <input class="file-input__file" hidden id="photo-file" type="file">
          </div>
        </template>
        <template id="error-message"><p class="error-message"></p></template>
      </file-input-field>
    `);

    assert.ok(element.querySelector(".input-button-group .file-input__picker"));
  });

  it("Adds the find location button that only exists in its template", () => {
    const element = mount(`
      <geo-input-field i18n-denied="Denied" i18n-failed="Failed">
        <input class="input geo-input" id="location">
        <template id="geo-input-button">
          <button class="button geo-input__button" type="button">Find</button>
        </template>
        <template id="error-message"><p class="error-message"></p></template>
      </geo-input-field>
    `);

    assert.ok(element.querySelector(".input-button-group .geo-input__button"));
  });
});
