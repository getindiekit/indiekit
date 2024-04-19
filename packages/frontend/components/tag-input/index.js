import TagInput from "@accessible-components/tag-input";

export const TagInputFieldComponent = class extends HTMLElement {
  connectedCallback() {
    this.$errorMessage = this.querySelector(".error-message");
    this.$hint = this.querySelector(".hint");
    this.$replacedLabel = this.querySelector(".label");
    this.$replacedInput = this.querySelector(".input");
    this.value = this.$replacedInput.getAttribute("value");

    const tags = this.value ? this.value.split(",") : [];

    const tagInput = new TagInput(this, {
      ariaTag: this.getAttribute("i18n-tag"),
      ariaEditTag: this.getAttribute("i18n-edit"),
      ariaDeleteTag: this.getAttribute("i18n-delete"),
      ariaTagAdded: this.getAttribute("i18n-added"),
      ariaTagDeleted: this.getAttribute("i18n-deleted"),
      ariaTagUpdated: this.getAttribute("i18n-updated"),
      ariaTagSelected: this.getAttribute("i18n-selected"),
      ariaNoTagsSelected: this.getAttribute("i18n-none-selected"),
      ariaInputLabel: this.getAttribute("i18n-instruction"),
      disabled: this.$replacedInput.getAttribute("disabled"),
      label: this.$replacedLabel.innerHTML,
      name: this.$replacedInput.getAttribute("name"),
      placeholder: this.getAttribute("placeholder"),
      tags,
    });

    if (this.$hint) {
      this.insertBefore(this.$hint, this.querySelector(".tag-input"));
    }

    if (this.$errorMessage) {
      this.insertBefore(this.$errorMessage, this.querySelector(".tag-input"));
    }

    this.querySelector(".tag-input-label").classList.add("label");

    this.$replacedLabel.remove();
    this.$replacedInput.remove();

    /**
     * @type {HTMLInputElement}
     */
    const $tagInputInput = this.querySelector(".tag-input__input");

    // Add a tag when the Comma key is pressed. This matches the parsing done
    // when JavaScript is not enabled, meaning hint text correct in both cases.
    $tagInputInput.addEventListener("keydown", (event) => {
      if (event.code === "Comma") {
        event.preventDefault();
        tagInput.addTag($tagInputInput.value, false);
        $tagInputInput.value = "";
      }
    });

    // Capture any value in input not converted to tag (for example, by clicking
    // outside component before pressing tab key) and add to list of tags.
    $tagInputInput.addEventListener("blur", () => {
      if ($tagInputInput.value) {
        tagInput.addTag($tagInputInput.value, false);
        $tagInputInput.value = "";
      }
    });

    return tagInput;
  }
};
