import { Controller } from "@hotwired/stimulus";

export const NotificationController = class extends Controller {
  initialize() {
    if (this.element.dataset.disableAutoFocus === "true") {
      return;
    }

    if (this.element.getAttribute("role") !== "alert") {
      return;
    }

    // Set tabindex to -1 to make element focusable with JavaScript.
    // Remove tabindex on blur as component doesn’t need to be focusable
    // after page has loaded.
    if (!this.element.getAttribute("tabindex")) {
      this.element.setAttribute("tabindex", "-1");

      this.element.addEventListener("blur", function () {
        this.element.removeAttribute("tabindex");
      });
    }

    this.element.focus();
  }
};
