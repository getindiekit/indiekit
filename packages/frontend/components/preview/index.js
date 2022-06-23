import { Controller } from "@hotwired/stimulus";

export const PreviewController = class extends Controller {
  static targets = ["text", "title", "url"];

  connect() {
    this.updatePreview(this.textTarget);
    this.updatePreview(this.titleTarget);
    this.updatePreview(this.urlTarget);
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
   *
   * @param {Object<HTMLElement>} outputElement - Output element
   * @param {Object<HTMLElement>} inputElement - Input element
   */
  updatePreview(outputElement, inputElement = false) {
    outputElement.classList.add("placeholder");
    outputElement.value = outputElement.dataset.placeholder;

    if (inputElement && inputElement.value !== "") {
      outputElement.classList.remove("placeholder");
      outputElement.value = decodeURIComponent(inputElement.value);
    }
  }
};
