const focusableSelector = `a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), audio[controls], video[controls], iframe, embed, object, summary, [contenteditable], [tabindex]`;

export const focusableElements = {
  /**
   * @returns {Array} All focusable, keyboard navigable and visible elements
   */
  get all() {
    const focusable = [...document.querySelectorAll(focusableSelector)];
    const navigable = focusable.filter((element) => element.tabIndex !== -1);
    const visible = navigable.filter(
      (element) => window.getComputedStyle(element).display !== "none"
    );

    return visible;
  },

  /**
   * @returns {number} Index of currently focused element
   */
  get currentIndex() {
    return this.all.indexOf(document.activeElement);
  },

  /**
   * @returns {number} Index of next focusable element
   */
  get nextIndex() {
    return (this.currentIndex + 1) % this.all.length;
  },

  /**
   * @returns {number} Index of previous focusable element
   */
  get previousIndex() {
    return (this.currentIndex - 1 + this.all.length) % this.all.length;
  },

  /**
   * @returns {HTMLElement} Next focusable element
   */
  get next() {
    return this.all[this.nextIndex];
  },

  /**
   * @returns {HTMLElement} Previous focusable element
   */
  get previous() {
    return this.all[this.previousIndex];
  },
};
