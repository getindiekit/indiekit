import { Controller } from "@hotwired/stimulus";

export const GeoInputController = class extends Controller {
  static targets = ["errorMessage", "geo"];

  static values = {
    denied: String,
    failed: String,
  };

  initialize() {
    if (!navigator.geolocation) {
      return;
    }

    // Create group to hold input and button
    const inputButtonGroup = document.createElement("div");
    inputButtonGroup.classList.add("input-button-group");

    // Create and display find location button
    const buttonTemplate = document.querySelector("#geo-input-button");
    const button = buttonTemplate.content.cloneNode(true);
    const input = this.element.querySelector(".input");

    // Move input into group, and append find location button
    input.parentNode.insertBefore(inputButtonGroup, input);
    inputButtonGroup.append(input, button);
  }

  showError(element, message) {
    const input = element.querySelector(".input");
    const inputButtonGroup = element.querySelector(".input-button-group");
    const inputField = element.querySelector(".field");

    // Create error message
    const errorMessageTemplate = document.querySelector(
      "#geo-input-error-message"
    );
    const errorMessageElement = errorMessageTemplate.content.cloneNode(true);
    inputButtonGroup.before(errorMessageElement);
    const errorMessage = element.querySelector(".error-message");
    const errorMessageText = element.querySelector(".error-message__text");

    // Add field error class
    inputField.classList.add("field--error");

    // Add error message text
    errorMessageText.textContent = message;

    // Update `aria-describedby` on input element to reference error message
    const inputAttributes = input.getAttribute("aria-describedby") || "";
    input.setAttribute(
      "aria-describedby",
      [inputAttributes, errorMessage.id].join(" ")
    );
  }

  /**
   * @typedef GeolocationPosition
   * @property {object} position - Position
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition}
   * @typedef GeolocationPositionError
   * @property {object} error - Error
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError}
   */
  find() {
    const { element, geoTarget, deniedValue, failedValue, showError } = this;

    /**
     * @param {GeolocationPosition} position - Position
     */
    function success(position) {
      const latitude = position.coords.latitude.toFixed(5);
      const longitude = position.coords.longitude.toFixed(5);
      geoTarget.value = [latitude, longitude].join(",");
    }

    /**
     * @param {GeolocationPositionError} error - Position error
     */
    function error(error) {
      element.querySelector(".button").disabled = true;

      if (error.PERMISSION_DENIED) {
        showError(element, deniedValue);
      } else if (error.POSITION_UNAVAILABLE) {
        showError(element, failedValue);
      }
    }

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
    });
  }
};
