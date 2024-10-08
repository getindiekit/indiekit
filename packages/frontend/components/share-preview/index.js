export const SharePreviewComponent = class extends HTMLElement {
  connectedCallback() {
    this.$form = this.closest("form");
    this.$$outputs = this.querySelectorAll("output");
    for (const $output of this.$$outputs) {
      this.updatePreview($output);
    }

    this.resizeWindow();
  }

  /**
   * Resize parent window to fit output preview and input form
   */
  resizeWindow() {
    if (this.$form) {
      const { scrollWidth, scrollHeight } = this.$form;

      const chromeWidth = globalThis.outerWidth - window.innerWidth;
      const chromeHeight = globalThis.outerHeight - window.innerHeight;

      const width = scrollWidth + chromeWidth;
      const height = scrollHeight + chromeHeight;

      window.resizeTo(width, height);
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
