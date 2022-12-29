import { Controller } from "@hotwired/stimulus";

export const NotificationController = class extends Controller {
  initialize() {
    const { element } = this;

    if (element.dataset.disableAutoFocus === "true") {
      return;
    }

    if (element.getAttribute("role") !== "alert") {
      return;
    }

    // Set tabindex to -1 to make element focusable with JavaScript.
    // Remove tabindex on blur as component doesn’t need to be focusable
    // after page has loaded.
    if (!element.getAttribute("tabindex")) {
      element.setAttribute("tabindex", "-1");

      element.addEventListener("blur", function () {
        element.removeAttribute("tabindex");
      });
    }

    element.focus();
  }
};
