import { Controller } from "@hotwired/stimulus";
import { debounce } from "../../lib/utils/debounce.js";

export const TextareaController = class extends Controller {
  initialize() {
    this.adjustHeight = this.adjustHeight.bind(this);
  }

  connect() {
    const delay = 100;

    this.element.style.overflow = "hidden";
    this.onResize =
      delay > 0 ? debounce(this.adjustHeight, delay) : this.adjustHeight;
    this.adjustHeight();

    this.element.addEventListener("input", this.adjustHeight);
    window.addEventListener("resize", this.onResize);
  }

  disconnect() {
    window.removeEventListener("resize", this.onResize);
  }

  adjustHeight() {
    this.element.style.height = "auto";
    this.element.style.height = `${this.element.scrollHeight + 4}px`;
  }
};
