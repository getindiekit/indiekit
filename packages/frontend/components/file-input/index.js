import { IndiekitError } from "@indiekit/error";

import { wrapElement } from "../../scripts/utils/wrap-element.js";

export const FileInputFieldController = class extends HTMLElement {
  /**
   * @type {HTMLElement}
   */
  $uploadProgress;

  /**
   * @type {HTMLInputElement}
   */
  $fileInputPath;

  /**
   * @type {HTMLElement}
   */
  $fileInputPicker;

  /**
   * @type {HTMLTemplateElement}
   */
  $fileInputPickerTemplate;

  /**
   * @type {HTMLTemplateElement}
   */
  $errorMessageTemplate;

  connectedCallback() {
    this.endpoint = this.getAttribute("endpoint");

    this.$uploadProgress = this.querySelector(".file-input__progress");
    this.$fileInputPath = this.querySelector(".file-input__path");
    this.$fileInputPicker = this.querySelector(".file-input__picker");
    this.$fileInputPickerTemplate = this.querySelector("#file-input-picker");
    this.$errorMessageTemplate = this.querySelector("#error-message");

    if (!this.$fileInputPicker) {
      // Create group to hold input and button
      const $inputButtonGroup = document.createElement("div");
      $inputButtonGroup.classList.add("input-button-group");

      // Create upload button
      const $fileInputPicker =
        this.$fileInputPickerTemplate.content.cloneNode(true);

      // Wrap input within `input-button-group` container
      wrapElement(this.$fileInputPath, $inputButtonGroup);

      // Add button to `input-button-group` container
      $inputButtonGroup.append($fileInputPicker);

      // Update `this.$fileInputPicker`
      this.$fileInputPicker = this.querySelector(".file-input__picker");
    }

    // Make file input label behave like a button to trigger file input
    const $fileInputButton = /** @type {HTMLElement} */ (
      this.$fileInputPicker.querySelector(`.file-input__button`)
    );

    $fileInputButton.addEventListener("keydown", (event) => {
      // Prevent default behaviour, including scrolling using spacebar
      if (["Spacebar", " ", "Enter"].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === "Enter") {
        const $target = /** @type {HTMLElement} */ (event.target);

        $target.click();
      }
    });

    $fileInputButton.addEventListener("keyup", (event) => {
      if (!["Spacebar", " "].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const $target = /** @type {HTMLElement} */ (event.target);

      $target.click();
    });

    // Add event to file input
    const $fileInputFile =
      this.$fileInputPicker.querySelector(`.file-input__file`);
    $fileInputFile.addEventListener("change", (event) => this.fetch(event));
  }

  /**
   * Fetch file
   * @param {Event} event - File input event
   */
  async fetch(event) {
    this.$uploadProgress.hidden = false;

    const $target = /** @type {HTMLInputElement} */ (event.target);
    const formData = new FormData();

    formData.append("file", $target.files[0]);

    try {
      this.$fileInputPath.readOnly = true;

      const endpointResponse = await fetch(this.endpoint, {
        body: formData,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      if (!endpointResponse.ok) {
        throw await IndiekitError.fromFetch(endpointResponse);
      }

      this.$fileInputPath.value =
        await endpointResponse.headers.get("location");
      this.$fileInputPath.readOnly = false;
      this.$uploadProgress.hidden = true;
    } catch (error) {
      this.showErrorMessage(
        error instanceof Error ? error.message : String(error),
      );
      this.$fileInputPath.readOnly = false;
      this.$uploadProgress.hidden = true;
    }
  }

  showErrorMessage(message) {
    const $input = /** @type {HTMLElement} */ (this.querySelector(".input"));
    const $inputButtonGroup = /** @type {HTMLElement} */ (
      this.querySelector(".input-button-group")
    );

    // Create error message
    const $errorMessageFragment =
      this.$errorMessageTemplate.content.cloneNode(true);
    $inputButtonGroup.before($errorMessageFragment);

    const $errorMessage = /** @type {HTMLElement} */ (
      this.querySelector(".error-message")
    );
    const $errorMessageText = /** @type {HTMLElement} */ (
      this.querySelector(".error-message__text")
    );

    // Add error class to field
    this.classList.add("field--error");

    // Add error message text
    $errorMessageText.textContent = message;

    // Update `aria-describedby` on input element to reference error message
    const inputAttributes = $input.getAttribute("aria-describedby") || "";
    $input.setAttribute(
      "aria-describedby",
      [inputAttributes, $errorMessage.id].join(" "),
    );
  }
};
