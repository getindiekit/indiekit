import { Controller } from "@hotwired/stimulus";

const updatePreview = (outputElement, inputElement = false) => {
  outputElement.classList.add("placeholder");
  outputElement.value = outputElement.dataset.placeholder;

  if (inputElement && inputElement.value !== "") {
    outputElement.classList.remove("placeholder");
    outputElement.value = decodeURIComponent(inputElement.value);
  }
};

export const PreviewController = class extends Controller {
  static targets = ["text", "title", "url"];

  connect() {
    updatePreview(this.textTarget);
    updatePreview(this.titleTarget);
    updatePreview(this.urlTarget);
  }

  text(event) {
    updatePreview(this.textTarget, event.target);
  }

  title(event) {
    updatePreview(this.titleTarget, event.target);
  }

  url(event) {
    updatePreview(this.urlTarget, event.target);
  }
};
