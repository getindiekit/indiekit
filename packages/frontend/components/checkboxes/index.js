/**
 * Based by the checkboxes component provided by GOV.UK Frontend
 * @see {@link https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/checkboxes/checkboxes.mjs}
 */
export const CheckboxesFieldComponent = class extends HTMLElement {
  connectedCallback() {
    this.$$inputTargets = this.querySelectorAll("input");
    for (const $input of this.$$inputTargets) {
      const targetId = $input.dataset.ariaControls;
      const $conditional = document.querySelector(`#${targetId}`);

      // Promote `data-aria-controls` attribute to an `aria-controls` attribute
      // so that relationship is exposed in the AOM
      if (targetId && $conditional) {
        $input.setAttribute("aria-controls", targetId);
        delete $input.dataset.ariaControls;
      }

      $input.addEventListener("input", (event) =>
        this.toggleConditional(event),
      );
    }

    this.syncAllConditionalReveals();
  }

  /**
   * Input event handler
   *
   * Sync state of conditional reveal with checkbox state
   * @param {Event} event - Event
   */
  toggleConditional(event) {
    const $target = event.target;

    // If the checkbox conditionally-reveals content, sync the state
    if ($target.hasAttribute("aria-controls")) {
      this.syncConditionalRevealWithInputState($target);
    }

    // No further behaviour needed for unchecking
    if (!$target.checked) {
      return;
    }

    // Handle ‘exclusive’ checkbox behaviour (ie “None of these”)
    if ($target.dataset.behaviour === "exclusive") {
      this.unCheckAllInputsExcept($target);
    } else {
      this.unCheckExclusiveInputs($target);
    }
  }

  /**
   * Sync conditional reveal states for all checkboxes in this checkbox group
   */
  syncAllConditionalReveals() {
    for (const $input of this.$$inputTargets) {
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
    const $$inputsWithSameName = document.querySelectorAll(
      `input[type="checkbox"][name="${$input.name}"]`,
    );

    for (const $inputWithSameName of $$inputsWithSameName) {
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
    const $$inputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(
      `input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`,
    );

    for (const $exclusiveInput of $$inputsWithSameNameAndExclusiveBehaviour) {
      const hasSameFormOwner = $input.form === $exclusiveInput.form;
      if (hasSameFormOwner) {
        $exclusiveInput.checked = false;
        this.syncConditionalRevealWithInputState($exclusiveInput);
      }
    }
  }
};
