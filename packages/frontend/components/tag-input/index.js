import TagInput from "@accessible-components/tag-input";

export const TagInputFieldComponent = class extends HTMLElement {
  connectedCallback() {
    const $hint = this.querySelector(".hint");
    const $replacedInput = this.querySelector(".input");
    const $replacedLabel = this.querySelector(".label");

    const value = $replacedInput.getAttribute("value");
    const tags = value ? $replacedInput.getAttribute("value").split(",") : [];

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
      disabled: $replacedInput.getAttribute("disabled"),
      label: $replacedLabel.innerHTML,
      name: $replacedInput.getAttribute("name"),
      placeholder: this.getAttribute("placeholder"),
      tags,
    });

    this.insertBefore($hint, this.querySelector(".tag-input"));
    this.querySelector(".tag-input-label").classList.add("label");

    $replacedLabel.remove();
    $replacedInput.remove();

    /**
     * @type {HTMLInputElement}
     */
    const $tagInputInput = this.querySelector(".tag-input__input");

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
