import { getElement } from "../../scripts/utils/get-element";

export const EventDurationComponent = class extends HTMLElement {
  /**
   * @returns {HTMLInputElement} All day toggle
   */
  get $allDayToggle() {
    return getElement(this, `input[type="checkbox"]`);
  }

  /**
   * @returns {NodeListOf<HTMLInputElement>} Date time inputs
   */
  get $$dateTimeInputs() {
    return this.querySelectorAll(`input[type="datetime-local"]`);
  }

  connectedCallback() {
    this.updateDateTimeInputs();
  }

  updateDateTimeInputs() {
    for (const $dateInput of this.$$dateTimeInputs) {
      $dateInput.type = this.$allDayToggle.checked ? "date" : "datetime-local";

      this.$allDayToggle.addEventListener("click", () => {
        const initialValue = $dateInput.value;
        if (this.$allDayToggle.checked) {
          $dateInput.type = "date";
          $dateInput.value = initialValue.split("T", 1)[0];
        } else {
          $dateInput.type = "datetime-local";
          $dateInput.value = `${initialValue}T12:30`;
        }
      });
    }
  }
};
