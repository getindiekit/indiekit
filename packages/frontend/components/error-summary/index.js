/* eslint-disable jsdoc/no-undefined-types */
import { Controller } from "@hotwired/stimulus";

/**
 * Based by the error summary component provided by GOV.UK Frontend
 * @see {@link https://github.com/alphagov/govuk-frontend/blob/main/src/govuk/components/error-summary/error-summary.js}
 */
export const ErrorSummaryController = class extends Controller {
  connect() {
    this.setFocus();
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  /**
   * Focus the error summary
   */
  setFocus() {
    if (this.element.dataset.disableAutoFocus === "true") {
      return;
    }

    // Set tabindex to -1 to make the element programmatically focusable…
    this.element.setAttribute("tabindex", "-1");

    // …and remove it on blur as error summary doesn’t need to be focused again
    this.element.addEventListener("blur", function (event) {
      event.target.removeAttribute("tabindex");
    });

    this.element.focus();
  }

  /**
   * Click event handler
   * @param {object} event - Click event
   */
  handleClick(event) {
    if (this.focusTarget(event.target)) {
      event.preventDefault();
    }
  }

  /**
   * Focus target element
   *
   * By default, the browser will scroll the target into view. Because our
   * labels and legends appear above their respective inputs, this means users
   * will be presented with inputs without any context, with the label or
   * legend will off the top of the screen.
   *
   * Manually handling the click event, scrolling the question into view and
   * then focussing the element solves this.
   *
   * This also results in the label and/or legend being announced correctly in
   * NVDA - without this only the field type is announced (e.g. "Edit, has
   * autocomplete").
   * @param {HTMLElement} target - Event target
   * @returns {boolean} True if the target was able to be focussed
   */
  focusTarget(target) {
    // If the element that was clicked was not a link, return early
    if (target.tagName !== "A" || target.href === false) {
      return false;
    }

    const fragment = this.getFragmentFromUrl(target.href);
    const input = document.querySelector(`#${fragment}`);
    if (!input) {
      return false;
    }

    const legendOrLabel = this.getAssociatedLegendOrLabel(input);
    if (!legendOrLabel) {
      return false;
    }

    // Scroll the legend or label into view _before_ calling focus on the input
    // to avoid extra scrolling in browsers that don’t support `preventScroll`
    legendOrLabel.scrollIntoView();
    input.focus({ preventScroll: true });

    return true;
  }

  /**
   * Get fragment name from a URL
   * @param {string} url - URL
   * @returns {string} Fragment name (without the hash)
   */
  getFragmentFromUrl(url) {
    return url.startsWith("#") ? false : url.split("#").pop();
  }

  /**
   * Get associated legend or label
   *
   * Returns first element that exists from this list:
   *
   * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
   *   as the top of it is no more than half a viewport height away from the
   *   bottom of the input
   * - The first `<label>` that is associated with the input using for="inputId"
   * - The closest parent `<label>`
   * @param {HTMLElement} input - The input
   * @returns {HTMLLegendElement|HTMLLabelElement} Associated legend or label, null if none found
   */
  getAssociatedLegendOrLabel(input) {
    const fieldset = input.closest("fieldset");

    if (fieldset) {
      const legends = fieldset.querySelectorAll("legend");

      if (legends.length > 0) {
        const candidateLegend = legends[0];

        // If input type is radio or checkbox, use legend if there is one
        if (input.type === "checkbox" || input.type === "radio") {
          return candidateLegend;
        }

        // For other input types, only scroll to the fieldset’s legend (instead
        // of the label associated with the input) if the input would end up in
        // the top half of the screen.
        //
        // This should avoid situations where the input either ends up off the
        // screen, or obscured by a software keyboard.
        const legendTop = candidateLegend.getBoundingClientRect().top;
        const inputRect = input.getBoundingClientRect();

        // If the browser doesn’t support Element.getBoundingClientRect().height
        // or window.innerHeight (like IE8), bail and just link to the label.
        if (inputRect.height && window.innerHeight) {
          const inputBottom = inputRect.top + inputRect.height;

          if (inputBottom - legendTop < window.innerHeight / 2) {
            return candidateLegend;
          }
        }
      }
    }

    return (
      document.querySelector("label[for='" + input.getAttribute("id") + "']") ||
      input.closest("label")
    );
  }
};
