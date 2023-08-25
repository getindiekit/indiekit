/* eslint-disable jsdoc/no-undefined-types */
import { Controller } from "@hotwired/stimulus";
import { wrapElement } from "../../lib/utils/wrap-element.js";

export const GeoInputController = class extends Controller {
  static targets = ["errorMessage", "findButton", "geo"];

  static values = {
    denied: String,
    failed: String,
  };

  initialize() {
    if (!navigator.geolocation) {
      return;
    }

    // Create group to hold input and button
    const $inputButtonGroup = document.createElement("div");
    $inputButtonGroup.classList.add("input-button-group");

    // Create and display find location button
    const $button = this.findButtonTarget.content.cloneNode(true);
    const $input = this.element.querySelector(".input");

    // Wrap input within `input-button-group` container
    wrapElement($input, $inputButtonGroup);

    // Add button to `input-button-group` container
    $inputButtonGroup.append($button);
  }

  /**
   * Get current geo location position
   */
  find() {
    navigator.geolocation.getCurrentPosition(
      this.positionSuccess.bind(this),
      this.positionError.bind(this),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    );
  }

  /**
   * Populate input with geo location position
   * @param {GeolocationPosition} position - Position
   */
  positionSuccess(position) {
    const latitude = position.coords.latitude.toFixed(5);
    const longitude = position.coords.longitude.toFixed(5);
    this.geoTarget.value = [latitude, longitude].join(",");
  }

  /**
   * Display geo location position error message
   * @param {GeolocationPositionError} error - Position error
   */
  positionError(error) {
    /** @satisfies {HTMLButtonElement} */
    const $button = this.element.querySelector(".button");

    $button.disabled = true;

    if (error.PERMISSION_DENIED) {
      this.showErrorMessage(this.element, this.deniedValue);
    } else if (error.POSITION_UNAVAILABLE) {
      this.showErrorMessage(this.element, this.failedValue);
    }
  }

  showErrorMessage($field, message) {
    const $input = $field.querySelector(".input");
    const $inputButtonGroup = $field.querySelector(".input-button-group");

    // Create error message
    let $errorMessage = this.errorMessageTarget.content.cloneNode(true);
    $inputButtonGroup.before($errorMessage);
    $errorMessage = $field.querySelector(".error-message");
    const $errorMessageText = $field.querySelector(".error-message__text");

    // Add field error class
    $field.classList.add("field--error");

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
