import { Controller } from "@hotwired/stimulus";
import { wrapElement } from "../../lib/utils/wrap-element.js";

const focusableSelector = `button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]`;

export const AddAnotherController = class extends Controller {
  static targets = ["addButton", "deleteButton", "field", "list", "item"];

  initialize() {
    this.setupItems();
    this.updateItems();
    this.createAddButton();
  }

  /**
   * Add item to list
   * @param {Event} event - Add button event
   */
  add(event) {
    event.preventDefault();
    const $newItem = this.createItem();
    this.listTarget.append($newItem);
    this.updateItems();
    $newItem.querySelector(focusableSelector).focus();
  }

  /**
   * Delete item from list
   * @param {Event} event - Delete button event
   */
  delete(event) {
    event.preventDefault();
    event.target.closest("li").remove();
    this.updateItems();
    this.focusHeading();
  }

  /**
   * Get heading
   * @returns {HTMLLegendElement} - Group legend
   */
  getHeading() {
    return this.element.querySelector("legend");
  }

  /**
   * Focus heading
   */
  focusHeading() {
    const $heading = this.getHeading();

    $heading.setAttribute("tabindex", "-1");
    $heading.focus();
  }

  /**
   * Create add button
   */
  createAddButton() {
    const $addButton = this.addButtonTarget.content.cloneNode(true);

    this.element.append($addButton);
  }

  /**
   * Get delete button
   * @param {HTMLElement} element - Containing element
   * @returns {HTMLButtonElement} - Delete button
   */
  getDeleteButton(element) {
    return element.querySelector(".button--warning");
  }

  /**
   * Create delete button
   * @param {HTMLElement} element - Containing element
   */
  createDeleteButton(element) {
    const $deleteButton =
      this.deleteButtonTarget.content.firstElementChild.cloneNode(true);

    element.append($deleteButton);
  }

  /**
   * Update delete button
   * @param {HTMLElement} element - Containing element
   */
  updateDeleteButton(element) {
    const $deleteButton = this.getDeleteButton(element);
    $deleteButton.setAttribute("aria-labelledby", `delete-title ${element.id}`);
  }

  /**
   * Take existing form fields and warp in list item
   */
  setupItems() {
    for (const field of this.fieldTargets.values()) {
      const $item = document.createElement("li");
      $item.classList.add("add-another__list-item");
      $item.dataset.addAnotherTarget = "item";

      wrapElement(field, $item);
    }
  }

  /**
   * Create new item by cloning first item in list and updating its attributes
   * @returns {HTMLLIElement} - List item containing form field(s)
   */
  createItem() {
    const $item = this.itemTargets.at(0).cloneNode(true);
    const uid = Date.now().toString();

    const $fields = $item.querySelectorAll("input, select, textarea");
    for (const $field of $fields) {
      $field.id = $field.id.replace("-0", `-${uid}`);
      $field.name = $field.name.replace("[0]", `[${uid}]`);
      $field.value = "";
    }

    const $labels = $item.querySelectorAll("label");
    for (const $label of $labels) {
      const forAttribute = $label.getAttribute("for");
      $label.setAttribute("for", forAttribute.replace("-0", `-${uid}`));
    }

    $item.id = `${this.element.id}-${uid}`;

    return $item;
  }

  /**
   * Update all items
   * - Update ID’s to use for labelling remove button
   * - Update ARIA label to reference item’s position in list
   * - Add remove buttons (or remove if only one item remaining in list)
   */
  updateItems() {
    const $items = this.itemTargets;

    for (const [index, $item] of $items.entries()) {
      $item.id = $item.id || `${this.element.id}-${index}`;
      $item.setAttribute("aria-label", `Item ${index + 1}`);

      // If no delete button, add one (if more than 1 item in list)
      // Used when initializing
      if (!this.getDeleteButton($item) && $items.length > 1) {
        this.createDeleteButton($item);
      }

      // If has delete button
      if (this.getDeleteButton($item)) {
        if ($items.length === 1) {
          // If only 1 item in list, remove button
          this.getDeleteButton($item).remove();
        } else {
          // Else update button attributes
          this.updateDeleteButton($item);
        }
      }
    }
  }
};
