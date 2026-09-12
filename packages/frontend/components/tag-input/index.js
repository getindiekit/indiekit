import TagInput from "@accessible-components/tag-input";

import { getElement } from "../../scripts/utils/get-element";

export const TagInputFieldComponent = class extends HTMLElement {
  connectedCallback() {
    this.$errorMessage = getElement(this, ".error-message");
    this.$hint = getElement(this, ".hint");
    this.$replacedLabel = getElement(this, ".label");
    this.$replacedInput = getElement(this, ".input");
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
      label: this.$replacedLabel.getHTML(),
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

    const $tagInputLabel = getElement(this, ".tag-input-label");
    $tagInputLabel.classList.add("label");

    this.$replacedLabel.remove();
    this.$replacedInput.remove();

    /**
     * @type {HTMLInputElement}
     */
    const $tagInputInput = getElement(this, ".tag-input__input");

    // Add a tag when the Comma key is pressed. This matches the parsing done
    // when JavaScript is not enabled, meaning hint text correct in both cases.
    $tagInputInput.addEventListener("keydown", (event) => {
      if (event.code !== "Comma") {
        return;
      }

      event.preventDefault();
      tagInput.addTag($tagInputInput.value, false);
      $tagInputInput.value = "";
    });

    // Capture any value in input not converted to tag (for example, by clicking
    // outside component before pressing tab key) and add to list of tags.
    $tagInputInput.addEventListener("blur", () => {
      if (!$tagInputInput.value) {
        return;
      }

      tagInput.addTag($tagInputInput.value, false);
      $tagInputInput.value = "";
    });

    return tagInput;
  }
};
