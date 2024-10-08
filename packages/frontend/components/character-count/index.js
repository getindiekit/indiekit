/**
 * Based on the Character count component from the GOV.UK Design System.
 * Provides a visible, real-time character and word count, and visually
 * hidden counter that announces updates to screen readers periodically.
 *
 * This component provides a character and word count, and doesn’t inform or
 * enforce any arbitrary content limits.
 * @see {@link https://design-system.service.gov.uk/components/character-count}
 * @see {@link https://dav-idc.com/making-a-character-count-component-more-accessible}
 */
export const CharacterCountComponent = class extends HTMLElement {
  constructor() {
    super();

    this.lastInputTimestamp = undefined;
    this.lastInputValue = "";
    this.valueChecker = undefined;

    this.$screenReaderCountMessage = document.createElement("p");
    this.$screenReaderCountMessage.className = "-!-visually-hidden";
    this.$screenReaderCountMessage.setAttribute("aria-live", "polite");
    this.$textareaDescription.insertAdjacentElement(
      "afterend",
      this.$screenReaderCountMessage,
    );

    this.$visibleCountMessage = document.createElement("p");
    this.$visibleCountMessage.className = this.$textareaDescription.className;
    this.$visibleCountMessage.setAttribute("aria-hidden", "true");
  }

  connectedCallback() {
    this.i18nChar = this.getAttribute("i18n-char") || `%s character`;
    this.i18nChars = this.getAttribute("i18n-chars") || `%s characters`;
    this.i18nWord = this.getAttribute("i18n-word") || `%s word`;
    this.i18nWords = this.getAttribute("i18n-words") || `%s words`;

    this.$textarea = this.querySelector("textarea");
    this.$textarea.addEventListener("keyup", this.#handleKeyUp.bind(this));
    this.$textarea.addEventListener("focus", this.#handleFocus.bind(this));
    this.$textarea.addEventListener("blur", this.#handleBlur.bind(this));
    window.addEventListener("pageshow", this.#updateCountMessages.bind(this));
    this.#updateCountMessages();

    this.$textareaDescription = this.querySelector(
      `#${this.$textarea.id}-info`,
    );
    this.$textareaDescription.classList.add("-!-visually-hidden");
    this.$textareaDescription.insertAdjacentElement(
      "afterend",
      this.$visibleCountMessage,
    );
  }

  /**
   * Update visible character counter and keep track of when the last update
   * happened for each keypress
   * @access private
   */
  #handleKeyUp() {
    this.#updateVisibleCountMessage();
    this.lastInputTimestamp = Date.now();
  }

  /**
   * Handle focus event
   *
   * Speech recognition software such as Dragon NaturallySpeaking will modify
   * a field by directly changing its `value`. These changes don’t trigger
   * events in JavaScript, so we need to poll to handle when and if they occur.
   *
   * Once the keyup event hasn’t been detected for at least 1000 ms (1s), check
   * if textarea value has changed and update count message if it has.
   *
   * This is so that update triggered by manual comparison doesn’t conflict
   * with debounced KeyboardEvent updates.
   * @access private
   */
  #handleFocus() {
    this.valueChecker = globalThis.setInterval(() => {
      if (
        !this.lastInputTimestamp ||
        Date.now() - 500 >= this.lastInputTimestamp
      ) {
        this.#updateIfValueChanged();
      }
    }, 1000);
  }

  /**
   * Stop checking textarea value once it no longer has focus
   * @access private
   */
  #handleBlur() {
    if (this.valueChecker) {
      globalThis.clearInterval(this.valueChecker);
    }
  }

  /**
   * Update count message if textarea value has changed
   * @access private
   */
  #updateIfValueChanged() {
    if (this.$textarea.value !== this.lastInputValue) {
      this.lastInputValue = this.$textarea.value;
      this.#updateCountMessages();
    }
  }

  /**
   * Helper method to update both visible and screen reader-specific counters
   * simultaneously (e.g. on init)
   * @access private
   */
  #updateCountMessages() {
    this.#updateVisibleCountMessage();
    this.#updateScreenReaderCountMessage();
  }

  /**
   * Update visible count message
   * @access private
   */
  #updateVisibleCountMessage() {
    this.$visibleCountMessage.textContent = this.#countMessage;
  }

  /**
   * Update screen reader count message
   * @access private
   */
  #updateScreenReaderCountMessage() {
    this.$screenReaderCountMessage.textContent = this.#countMessage;
  }

  /**
   * Count number of characters (or words) in given string
   * @access private
   * @param {string} string - The text to count the characters of
   * @param {boolean} [countWords] - Count words instead of characters
   * @returns {number} the number of characters (or words) in the text
   */
  #count(string, countWords = false) {
    if (countWords) {
      // Matches consecutive non-whitespace characters up to a word boundary
      const tokens = string.match(/\S+\b/g) ?? [];
      return tokens.length;
    }

    return string.length;
  }

  /**
   * Get count message
   * @access private
   * @returns {string} Status message
   */
  get #countMessage() {
    return this.#formatCountMessage(this.$textarea.value);
  }

  /**
   * Format and localise count shown to users
   * @access private
   * @param {string} string - Number of characters remaining
   * @returns {string} Status message
   */
  #formatCountMessage(string) {
    const characters = this.#count(string);
    const words = this.#count(string, true);

    let characterCount = this.i18nChars.replace("%s", String(characters));
    if (characters === 1) {
      characterCount = this.i18nChar.replace("%s", String(characters));
    }

    let wordCount = this.i18nWords.replace("%s", String(words));
    if (words === 1) {
      wordCount = this.i18nWord.replace("%s", String(words));
    }

    return `${characterCount}, ${wordCount}`;
  }
};
