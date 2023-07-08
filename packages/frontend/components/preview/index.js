/* eslint-disable jsdoc/no-undefined-types */
import { Controller } from "@hotwired/stimulus";

export const PreviewController = class extends Controller {
  static targets = ["text", "title", "url"];

  connect() {
    this.updatePreview(this.textTarget);

    this.updatePreview(
      this.titleTarget,
      this.element.querySelector("[data-action$=title]")
    );

    this.updatePreview(
      this.urlTarget,
      this.element.querySelector("[data-action$=url]")
    );
  }

  text(event) {
    this.updatePreview(this.textTarget, event.target);
  }

  title(event) {
    this.updatePreview(this.titleTarget, event.target);
  }

  url(event) {
    this.updatePreview(this.urlTarget, event.target);
  }

  /**
   * Update preview in output based on inputted value
   * @param {HTMLOutputElement} outputElement - Output element
   * @param {HTMLInputElement} [inputElement] - Input element
   */
  updatePreview(outputElement, inputElement) {
    outputElement.classList.add("placeholder");
    outputElement.value = outputElement.dataset.placeholder;

    if (inputElement && inputElement.value !== "") {
      outputElement.classList.remove("placeholder");
      outputElement.value = decodeURIComponent(inputElement.value);
    }
  }
};
