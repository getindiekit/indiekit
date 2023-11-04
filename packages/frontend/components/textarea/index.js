import { debounce } from "../../lib/utils/debounce.js";

export const TextareaFieldComponent = class extends HTMLElement {
  constructor() {
    super();

    this.adjustHeight = this.adjustHeight.bind(this);
    this.textarea = this.querySelector("textarea");
  }

  connectedCallback() {
    const delay = 100;

    this.textarea.style.overflow = "hidden";
    this.onResize =
      delay > 0 ? debounce(this.adjustHeight, delay) : this.adjustHeight;
    this.adjustHeight();

    this.textarea.addEventListener("input", this.adjustHeight);
    window.addEventListener("resize", this.onResize);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.onResize);
  }

  adjustHeight() {
    this.textarea.style.height = "auto";
    this.textarea.style.height = `${this.textarea.scrollHeight + 4}px`;
  }
};
