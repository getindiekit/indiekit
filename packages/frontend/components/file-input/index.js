import { IndiekitError } from "@indiekit/error";

import { getElement } from "../../scripts/utils/get-element.js";
import { openMediaBrowser } from "../../scripts/utils/media-browser.js";
import { wrapElement } from "../../scripts/utils/wrap-element.js";

export const FileInputFieldController = class extends HTMLElement {
  /**
   * @type {HTMLButtonElement|null} Geolocation button
   */
  // eslint-disable-next-line unicorn/no-null
  $fileInputPicker = null;

  /**
   * @returns {string} Media endpoint URL
   */
  get endpoint() {
    const endpoint = this.getAttribute("endpoint");

    if (!endpoint) {
      throw new Error("File input requires an `endpoint` attribute");
    }

    return endpoint;
  }

  /**
   * @returns {HTMLElement} Upload progress
   */
  get $uploadProgress() {
    return getElement(this, ".file-input__progress");
  }

  /**
   * @returns {HTMLInputElement} File input path
   */
  get $fileInputPath() {
    return getElement(this, ".file-input__path");
  }

  /**
   * @returns {HTMLTemplateElement} File input picker template
   */
  get $fileInputPickerTemplate() {
    return getElement(this, "#file-input-picker");
  }

  /**
   * @returns {HTMLTemplateElement} Error message template
   */
  get $errorMessageTemplate() {
    return getElement(this, "#error-message");
  }

  connectedCallback() {
    // The picker exists only in its template until it is added below
    this.$fileInputPicker = this.querySelector(".file-input__picker");

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
      this.$fileInputPicker = getElement(this, ".file-input__picker");
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

      if (event.key !== "Enter") {
        return;
      }

      const $target = /** @type {HTMLElement} */ (event.target);

      $target.click();
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
    const $fileInputFile = getElement(
      this.$fileInputPicker,
      ".file-input__file",
    );
    $fileInputFile.addEventListener("change", (event) => this.fetch(event));

    // Choose a file already uploaded instead
    const $fileInputBrowse = this.$fileInputPicker.querySelector(
      ".file-input__browse",
    );
    const $mediaBrowserTemplate = /** @type {HTMLTemplateElement | null} */ (
      this.querySelector("#media-browser")
    );
    if ($fileInputBrowse && $mediaBrowserTemplate) {
      $fileInputBrowse.addEventListener("click", () =>
        openMediaBrowser($mediaBrowserTemplate, {
          endpoint: this.endpoint,
          onSelect: (file) => {
            this.$fileInputPath.value = file.url;
          },
        }),
      );
    }
  }

  /**
   * Fetch file
   * @param {Event} event - File input event
   */
  async fetch(event) {
    const $target = /** @type {HTMLInputElement} */ (event.target);
    const [file] = $target.files ?? [];

    if (!file) {
      return;
    }

    this.$uploadProgress.hidden = false;

    const formData = new FormData();
    formData.append("file", file);

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

      const location = endpointResponse.headers.get("location");

      if (!location) {
        throw new Error("No location for uploaded file");
      }

      this.$fileInputPath.value = location;
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

  /**
   * Show error message
   * @param {string|null} message - Message
   */
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
