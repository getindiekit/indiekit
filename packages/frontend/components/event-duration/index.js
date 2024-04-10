export const EventDurationComponent = class extends HTMLElement {
  connectedCallback() {
    this.$allDayToggle = this.querySelector(`input[type="checkbox"]`);
    this.$$dateTimeInputs = this.querySelectorAll(
      `input[type="datetime-local"]`,
    );
    this.updateDateTimeInputs();
  }

  updateDateTimeInputs() {
    for (const $dateInput of this.$$dateTimeInputs) {
      $dateInput.type = this.$allDayToggle.checked ? "date" : "datetime-local";

      this.$allDayToggle.addEventListener("click", () => {
        const initialValue = $dateInput.value;
        if (this.$allDayToggle.checked) {
          $dateInput.type = "date";
          $dateInput.value = initialValue.split("T")[0];
        } else {
          $dateInput.type = "datetime-local";
          $dateInput.value = `${initialValue}T12:30`;
        }
      });
    }
  }
};
