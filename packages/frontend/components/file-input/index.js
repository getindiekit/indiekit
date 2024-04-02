/* eslint-disable jsdoc/no-undefined-types */
import { wrapElement } from "../../lib/utils/wrap-element.js";

export const FileInputFieldController = class extends HTMLElement {
  constructor() {
    super();

    this.endpoint = this.getAttribute("endpoint");

    /** @type {HTMLElement} */
    this.$uploadProgress = this.querySelector(".file-input__progress");
    this.$pathInput = this.querySelector(".file-input__path");

    this.$filePickerTemplate = this.querySelector("#file-input-picker");
    this.$errorMessageTemplate = this.querySelector("#error-message");
  }

  connectedCallback() {
    // Create group to hold input and button
    const $inputButtonGroup = document.createElement("div");
    $inputButtonGroup.classList.add("input-button-group");

    // Create and display upload button
    const $filePicker = this.$filePickerTemplate.content.cloneNode(true);

    // Wrap input within `input-button-group` container
    wrapElement(this.$pathInput, $inputButtonGroup);

    // Add button to `input-button-group` container
    $inputButtonGroup.append($filePicker);

    // Make label behave like a button
    const $pickerLabel = this.querySelector(`label[role="button"]`);
    $pickerLabel.addEventListener("keydown", (event) => {
      // Prevent default behaviour, including scrolling using spacebar
      if (["Spacebar", " ", "Enter"].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === "Enter") {
        event.target.click();
      }
    });

    $pickerLabel.addEventListener("keyup", (event) => {
      if (["Spacebar", " "].includes(event.key)) {
        event.preventDefault();
        event.target.click();
      }
    });

    // Add event to file input
    const $pickerInput = this.querySelector(`input[type="file"]`);
    $pickerInput.addEventListener("change", (event) => this.fetch(event));
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
      this.$pathInput.readOnly = true;

      const endpointResponse = await fetch(this.endpoint, {
        method: "POST",
        body: formData,
      });

      if (endpointResponse.ok) {
        this.$pathInput.value = await endpointResponse.headers.get("location");
      } else {
        this.showErrorMessage(endpointResponse.statusText);
      }

      this.$pathInput.readOnly = false;
      this.$uploadProgress.hidden = true;
    } catch (error) {
      this.showErrorMessage(error);
      this.$pathInput.readOnly = false;
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
