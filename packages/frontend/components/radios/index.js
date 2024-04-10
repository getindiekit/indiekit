/**
 * Based by the radios component provided by GOV.UK Frontend
 * @see {@link https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/radios/radios.mjs}
 */
export const RadiosFieldComponent = class extends HTMLElement {
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
        this.toggleConditionals(event),
      );
    }

    this.syncAllConditionalReveals();
  }

  /**
   * Input event handler
   *
   * Sync state of conditional reveal for all radios in same form with
   * same name (checking one radio could uncheck radio in another radio group)
   * @param {Event} event - Event
   */
  toggleConditionals(event) {
    const $target = event.target;

    // Only consider radios with conditional reveals, those which have an
    // `aria-controls` attribute
    const $$allInputs = document.querySelectorAll(
      `input[type="radio"][aria-controls]`,
    );

    for (const $input of $$allInputs) {
      const hasSameFormOwner = $input.form === $target.form;
      const hasSameName = $input.name === $target.name;

      if (hasSameName && hasSameFormOwner) {
        this.syncConditionalRevealWithInputState($input);
      }
    }
  }

  /**
   * Sync conditional reveal states for all radios in this radio group
   */
  syncAllConditionalReveals() {
    for (const $input of this.$$inputTargets.values()) {
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
