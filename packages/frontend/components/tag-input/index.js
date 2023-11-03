import TagInput from "@accessible-components/tag-input";

export const TagInputFieldComponent = class extends HTMLElement {
  connectedCallback() {
    const $hint = this.querySelector(".hint");
    const $replacedInput = this.querySelector(".input");
    const $replacedLabel = this.querySelector(".label");

    const value = $replacedInput.getAttribute("value");
    const tags = value ? $replacedInput.getAttribute("value").split(",") : [];

    const tagInput = new TagInput(this, {
      ariaTag: this.getAttribute("tag"),
      ariaEditTag: this.getAttribute("edit"),
      ariaDeleteTag: this.getAttribute("delete"),
      ariaTagAdded: this.getAttribute("added"),
      ariaTagDeleted: this.getAttribute("deleted"),
      ariaTagUpdated: this.getAttribute("updated"),
      ariaTagSelected: this.getAttribute("selected"),
      ariaNoTagsSelected: this.getAttribute("none-selected"),
      ariaInputLabel: this.getAttribute("instruction"),
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

    return tagInput;
  }
};
