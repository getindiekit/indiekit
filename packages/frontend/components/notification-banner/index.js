export const NotificationBannerComponent = class extends HTMLElement {
  connectedCallback() {
    if (this.getAttribute("disable-auto-focus") === "true") {
      return;
    }

    if (this.getAttribute("role") !== "alert") {
      return;
    }

    // Set tabindex to -1 to make element focusable with JavaScript.
    // Remove tabindex on blur as component doesn’t need to be focusable
    // after page has loaded.
    if (!this.getAttribute("tabindex")) {
      this.setAttribute("tabindex", "-1");

      this.addEventListener("blur", () => {
        this.removeAttribute("tabindex");
      });
    }

    this.focus();
  }
};
