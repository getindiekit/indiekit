import { Controller } from "@hotwired/stimulus";
import TagInput from "@accessible-components/tag-input";

export const TagInputController = class extends Controller {
  static values = {
    tag: String,
    placeholder: String,
    edit: String,
    delete: String,
    added: String,
    updated: String,
    deleted: String,
    selected: String,
    noneSelected: String,
    instruction: String,
  };

  initialize() {
    const {
      element,
      addedValue,
      deleteValue,
      deletedValue,
      editValue,
      instructionValue,
      noneSelectedValue,
      placeholderValue,
      selectedValue,
      tagValue,
      updatedValue,
    } = this;

    const $replacedField = element.querySelector(".field");
    const $replacedInput = element.querySelector(".input");
    const $replacedLabel = element.querySelector(".label");

    const value = $replacedInput.getAttribute("value");
    const tags = value ? $replacedInput.getAttribute("value").split(",") : [];

    const tagInput = new TagInput(element, {
      ariaTag: tagValue,
      ariaEditTag: editValue,
      ariaDeleteTag: deleteValue,
      ariaTagAdded: addedValue,
      ariaTagDeleted: deletedValue,
      ariaTagUpdated: updatedValue,
      ariaTagSelected: selectedValue,
      ariaNoTagsSelected: noneSelectedValue,
      ariaInputLabel: instructionValue,
      disabled: $replacedInput.getAttribute("disabled"),
      label: $replacedLabel.innerHTML,
      name: $replacedInput.getAttribute("name"),
      placeholder: placeholderValue,
      tags,
    });

    element.querySelector(".tag-input-label").classList.add("label");

    $replacedField.remove();

    return tagInput;
  }
};
