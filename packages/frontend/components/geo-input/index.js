/* eslint-disable jsdoc/no-undefined-types */
import { wrapElement } from "../../lib/utils/wrap-element.js";

export const GeoInputFieldComponent = class extends HTMLElement {
  connectedCallback() {
    this.i18nDenied = this.getAttribute("i18n-denied");
    this.i18nFailed = this.getAttribute("i18n-failed");

    this.$geoInput = this.querySelector(".geo-input");
    this.$geoInputButton = this.querySelector(".geo-input__button");
    this.$geoInputButtonTemplate = this.querySelector("#geo-input-button");
    this.$errorMessageTemplate = this.querySelector("#error-message");

    if (!navigator.geolocation) {
      return;
    }

    if (!this.$geoInputButton) {
      // Create group to hold input and button
      const $inputButtonGroup = document.createElement("div");
      $inputButtonGroup.classList.add("input-button-group");

      // Create find location button
      const $geoInputButton =
        this.$geoInputButtonTemplate.content.cloneNode(true);

      // Wrap input within `input-button-group` container
      wrapElement(this.$geoInput, $inputButtonGroup);

      // Add find location button to `input-button-group` container
      $inputButtonGroup.append($geoInputButton);

      // Update `this.$geoInputButton`
      this.$geoInputButton = this.querySelector(".geo-input__button");
    }

    // Add event to cloned button
    this.$geoInputButton.addEventListener("click", () => this.find());
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
    this.$geoInput.value = [latitude, longitude].join(",");
  }

  /**
   * Display geo location position error message
   * @param {GeolocationPositionError} error - Position error
   */
  positionError(error) {
    /** @satisfies {HTMLButtonElement} */
    const $button = this.querySelector(".button");

    $button.disabled = true;

    if (error.PERMISSION_DENIED) {
      this.showErrorMessage(this.i18nDenied);
    } else if (error.POSITION_UNAVAILABLE) {
      this.showErrorMessage(this.i18nFailed);
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
