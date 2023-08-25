/* eslint-disable jsdoc/no-undefined-types */
import { Controller } from "@hotwired/stimulus";

/**
 * Based by the checkboxes component provided by GOV.UK Frontend
 * @see {@link https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/checkboxes/checkboxes.mjs}
 */
export const CheckboxesController = class extends Controller {
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
   * Sync state of conditional reveal with checkbox state
   * @param {MouseEvent} event - Click event
   */
  toggleConditional(event) {
    const $clickedInput = event.target;

    // If the checkbox conditionally-reveals content, sync the state
    if ($clickedInput.hasAttribute("aria-controls")) {
      this.syncConditionalRevealWithInputState($clickedInput);
    }

    // No further behaviour needed for unchecking
    if (!$clickedInput.checked) {
      return;
    }

    // Handle ‘exclusive’ checkbox behaviour (ie “None of these”)
    if ($clickedInput.dataset.behaviour === "exclusive") {
      this.unCheckAllInputsExcept($clickedInput);
    } else {
      this.unCheckExclusiveInputs($clickedInput);
    }
  }

  /**
   * Sync conditional reveal states for all checkboxes in this checkbox group
   */
  syncAllConditionalReveals() {
    for (const $input of this.inputTargets.values()) {
      this.syncConditionalRevealWithInputState($input);
    }
  }

  /**
   * Synchronise visibility of conditional reveal, and its accessible
   * state, with the input’s checked state.
   * @param {HTMLInputElement} input - Checkbox input
   */
  syncConditionalRevealWithInputState(input) {
    const targetId = input.getAttribute("aria-controls");

    if (!targetId) {
      return;
    }

    const $target = document.querySelector(`#${targetId}`);

    if ($target && $target.classList.contains("checkboxes__conditional")) {
      const inputIsChecked = input.checked;

      input.setAttribute("aria-expanded", inputIsChecked.toString());
      $target.classList.toggle(
        "checkboxes__conditional--hidden",
        !inputIsChecked,
      );
    }
  }

  /**
   * Uncheck other checkboxes
   *
   * Find any other checkbox inputs with same name value, and uncheck them.
   * Useful when a “None of these” checkbox is checked.
   * @param {HTMLInputElement} $input - Checkbox input
   */
  unCheckAllInputsExcept($input) {
    /** @satisfies {NodeListOf<HTMLInputElement>} */
    const $allInputsWithSameName = document.querySelectorAll(
      `input[type="checkbox"][name="${$input.name}"]`,
    );

    for (const $inputWithSameName of $allInputsWithSameName) {
      const hasSameFormOwner = $input.form === $inputWithSameName.form;
      if (hasSameFormOwner && $inputWithSameName !== $input) {
        $inputWithSameName.checked = false;
        this.syncConditionalRevealWithInputState($inputWithSameName);
      }
    }
  }

  /**
   * Uncheck exclusive checkboxes
   *
   * Find any checkbox inputs with same name value and has the ‘exclusive’
   * behaviour, and uncheck them. This helps prevent someone checking both a
   * regular checkbox and a “None of these” checkbox in the same fieldset.
   * @param {HTMLInputElement} $input - Checkbox input
   */
  unCheckExclusiveInputs($input) {
    /** @satisfies {NodeListOf<HTMLInputElement>} */
    const $allInputsWithSameNameAndExclusiveBehaviour =
      document.querySelectorAll(
        `input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`,
      );

    for (const $exclusiveInput of $allInputsWithSameNameAndExclusiveBehaviour) {
      const hasSameFormOwner = $input.form === $exclusiveInput.form;
      if (hasSameFormOwner) {
        $exclusiveInput.checked = false;
        this.syncConditionalRevealWithInputState($exclusiveInput);
      }
    }
  }
};
