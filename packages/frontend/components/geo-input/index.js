import { getElement } from "../../scripts/utils/get-element.js";
import { wrapElement } from "../../scripts/utils/wrap-element.js";

export const GeoInputFieldComponent = class extends HTMLElement {
  /**
   * @type {HTMLButtonElement|null} Geolocation button
   */
  // eslint-disable-next-line unicorn/no-null
  $geoInputButton = null;

  /**
   * @returns {HTMLInputElement} Geolocation input
   */
  get $geoInput() {
    return getElement(this, ".geo-input");
  }

  /**
   * @returns {HTMLTemplateElement} Geolocation button template
   */
  get $geoInputButtonTemplate() {
    return getElement(this, "#geo-input-button");
  }

  /**
   * @returns {HTMLTemplateElement} Error message template
   */
  get $errorMessageTemplate() {
    return getElement(this, "#error-message");
  }

  /**
   * @returns {string|null} Localised ‘denied’ message
   */
  get i18nDenied() {
    return this.getAttribute("i18n-denied");
  }

  /**
   * @returns {string|null} Localised ‘failed’ message
   */
  get i18nFailed() {
    return this.getAttribute("i18n-failed");
  }

  connectedCallback() {
    if (!navigator.geolocation) {
      return;
    }

    // This button exists only in its template until it is added below
    this.$geoInputButton = this.querySelector(".geo-input__button");

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
      this.$geoInputButton = getElement(this, ".geo-input__button");
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
    const $button = /** @type {HTMLButtonElement} */ (
      this.querySelector(".button")
    );

    $button.disabled = true;

    if (error.PERMISSION_DENIED) {
      this.showErrorMessage(this.i18nDenied);
    } else if (error.POSITION_UNAVAILABLE) {
      this.showErrorMessage(this.i18nFailed);
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
