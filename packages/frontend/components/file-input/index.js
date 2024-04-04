/* eslint-disable jsdoc/no-undefined-types */
import { wrapElement } from "../../lib/utils/wrap-element.js";

export const FileInputFieldController = class extends HTMLElement {
  constructor() {
    super();

    this.endpoint = this.getAttribute("endpoint");

    /** @type {HTMLElement} */
    this.$uploadProgress = this.querySelector(".file-input__progress");
    this.$fileInputPath = this.querySelector(".file-input__path");
    this.$fileInputPicker = this.querySelector(".file-input__picker");
    this.$fileInputPickerTemplate = this.querySelector("#file-input-picker");
    this.$errorMessageTemplate = this.querySelector("#error-message");
  }

  connectedCallback() {
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
    const $fileInputButton =
      this.$fileInputPicker.querySelector(`.file-input__button`);

    $fileInputButton.addEventListener("keydown", (event) => {
      // Prevent default behaviour, including scrolling using spacebar
      if (["Spacebar", " ", "Enter"].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === "Enter") {
        event.target.click();
      }
    });

    $fileInputButton.addEventListener("keyup", (event) => {
      if (["Spacebar", " "].includes(event.key)) {
        event.preventDefault();
        event.target.click();
      }
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

    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      this.$fileInputPath.readOnly = true;

      const endpointResponse = await fetch(this.endpoint, {
        method: "POST",
        body: formData,
      });

      if (endpointResponse.ok) {
        this.$fileInputPath.value =
          await endpointResponse.headers.get("location");
      } else {
        this.showErrorMessage(endpointResponse.statusText);
      }

      this.$fileInputPath.readOnly = false;
      this.$uploadProgress.hidden = true;
    } catch (error) {
      this.showErrorMessage(error);
      this.$fileInputPath.readOnly = false;
      this.$uploadProgress.hidden = true;
    }
  }

  showErrorMessage(message) {
    const $input = this.querySelector(".input");
    const $inputButtonGroup = this.querySelector(".input-button-group");

    // Create error message
    let $errorMessage = this.$errorMessageTemplate.content.cloneNode(true);
    $inputButtonGroup.before($errorMessage);
    $errorMessage = this.querySelector(".error-message");
    const $errorMessageText = this.querySelector(".error-message__text");

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
