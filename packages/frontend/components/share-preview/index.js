export const SharePreviewComponent = class extends HTMLElement {
  static targets = ["text", "title", "url"];

  constructor() {
    super();

    this.outputs = this.querySelectorAll("output");
  }

  connectedCallback() {
    for (const $output of this.outputs) {
      this.updatePreview($output);
    }
  }

  /**
   * Update preview in output based on inputted value
   * @param {HTMLOutputElement} $outputElement - Output element
   */
  updatePreview($outputElement) {
    const { classList, dataset, htmlFor } = $outputElement;
    const $inputElement = document.querySelector(`[name=${htmlFor}]`);

    if (!$inputElement) {
      return;
    }

    classList.add("placeholder");
    $outputElement.value = dataset.placeholder;

    $inputElement.addEventListener("input", () => {
      if ($inputElement.value) {
        classList.remove("placeholder");
        $outputElement.value = decodeURIComponent($inputElement.value);
      } else {
        classList.add("placeholder");
        $outputElement.value = dataset.placeholder;
      }
    });
  }
};
