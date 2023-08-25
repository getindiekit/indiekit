/* eslint-disable jsdoc/no-undefined-types */
import { Controller } from "@hotwired/stimulus";

/**
 * Based by the radios component provided by GOV.UK Frontend
 * @see {@link https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/radios/radios.mjs}
 */
export const RadiosController = class extends Controller {
  static targets = ["input"];

  initialize() {
    for (const $input of this.inputTargets.values()) {
      const targetId = $input.dataset.ariaControls;
      const $conditional = document.querySelector(`#${targetId}`);

      // Promote `data-aria-controls` attribute to an `aria-controls` attribute
      // so that relationship is exposed in the AOM
      if (targetId && $conditional) {
        $input.setAttribute("aria-controls", targetId);
        delete $input.dataset.ariaControls;
      }
    }

    this.syncAllConditionalReveals();
  }

  /**
   * Click event handler
   *
   * Sync state of conditional reveal for all radios in same form with
   * same name (checking one radio could uncheck radio in another radio group)
   * @param {MouseEvent} event - Click event
   */
  toggleConditionals(event) {
    const $clickedInput = event.target;

    // Only consider radios with conditional reveals, those which have an
    // `aria-controls` attribute
    /** @satisfies {NodeListOf<HTMLInputElement>} */
    const $allInputs = document.querySelectorAll(
      `input[type="radio"][aria-controls]`,
    );

    for (const $input of $allInputs) {
      const hasSameFormOwner = $input.form === $clickedInput.form;
      const hasSameName = $input.name === $clickedInput.name;

      if (hasSameName && hasSameFormOwner) {
        this.syncConditionalRevealWithInputState($input);
      }
    }
  }

  /**
   * Sync conditional reveal states for all radios in this radio group
   */
  syncAllConditionalReveals() {
    for (const $input of this.inputTargets.values()) {
      this.syncConditionalRevealWithInputState($input);
    }
  }

  /**
   * Synchronise visibility of conditional reveal, and its accessible
   * state, with the input’s checked state.
   * @param {HTMLInputElement} input - Radio input
   */
  syncConditionalRevealWithInputState(input) {
    const targetId = input.getAttribute("aria-controls");

    if (!targetId) {
      return;
    }

    const $target = document.querySelector(`#${targetId}`);

    if ($target && $target.classList.contains("radios__conditional")) {
      const inputIsChecked = input.checked;

      input.setAttribute("aria-expanded", inputIsChecked.toString());
      $target.classList.toggle("radios__conditional--hidden", !inputIsChecked);
    }
  }
};
