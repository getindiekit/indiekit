export const SharePreviewComponent = class extends HTMLElement {
  static targets = ["text", "title", "url"];

  constructor() {
    super();

    this.$$outputs = this.querySelectorAll("output");
  }

  connectedCallback() {
    for (const $output of this.$$outputs) {
      this.updatePreview($output);
    }

    this.resizeWindow();
  }

  /**
   * Resize parent window to fit output preview and input form
   */
  resizeWindow() {
    const { scrollWidth, scrollHeight } = this.closest("form");

    const chromeWidth = window.outerWidth - window.innerWidth;
    const chromeHeight = window.outerHeight - window.innerHeight;

    const width = scrollWidth + chromeWidth;
    const height = scrollHeight + chromeHeight;

    window.resizeTo(width, height);
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
