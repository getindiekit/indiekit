const focusableSelector = `button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]`;

export const AddAnotherComponent = class extends HTMLElement {
  connectedCallback() {
    this.$addButtonTemplate = this.querySelector("#add-button");
    this.$deleteButtonTemplate = this.querySelector("#delete-button");
    this.$$fields = this.querySelectorAll(".field");
    this.$list = this.querySelector(".add-another__list");

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
    this.$list.append($newItem);
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
    return this.querySelector("legend");
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
    let $addButton = this.$addButtonTemplate.content.cloneNode(true);

    this.append($addButton);

    $addButton = this.querySelector(".add-another__add");
    $addButton.addEventListener("click", (event) => this.add(event));
  }

  /**
   * Get delete button
   * @param {HTMLElement} element - Containing element
   * @returns {HTMLButtonElement} - Delete button
   */
  getDeleteButton(element) {
    return element.querySelector(".add-another__delete");
  }

  /**
   * Create delete button
   * @param {HTMLElement} element - Containing element
   */
  createDeleteButton(element) {
    const $deleteButton =
      this.$deleteButtonTemplate.content.firstElementChild.cloneNode(true);

    element.append($deleteButton);
  }

  /**
   * Update delete button
   * @param {HTMLElement} element - Containing element
   */
  updateDeleteButton(element) {
    const $deleteButton = this.getDeleteButton(element);
    $deleteButton.setAttribute("aria-labelledby", `delete-title ${element.id}`);
    $deleteButton.addEventListener("click", (event) => this.delete(event));
  }

  /**
   * Create new item by cloning first item in list and updating its attributes
   * @returns {HTMLLIElement} - List item containing form field(s)
   */
  createItem() {
    const $$items = this.querySelectorAll(".add-another__list-item");
    const $item = $$items[0].cloneNode(true);
    const uid = Date.now().toString();

    const $$fields = $item.querySelectorAll(".field--error");
    for (const $field of $$fields) {
      $field.classList.remove("field--error");
    }

    const $$errorMessages = $item.querySelectorAll(".error-message");
    for (const $errorMessage of $$errorMessages) {
      $errorMessage.remove();
    }

    const $$inputs = $item.querySelectorAll("input, select, textarea");
    for (const $input of $$inputs) {
      $input.id = $input.id.replace("-0", `-${uid}`);
      $input.name = $input.name.replace("[0]", `[${uid}]`);
      $input.value = "";
      $input.classList.remove(
        "input--error",
        "select--error",
        "textarea--error",
      );
    }

    const $$labels = $item.querySelectorAll("label");
    for (const $label of $$labels) {
      const forAttribute = $label.getAttribute("for");
      $label.setAttribute("for", forAttribute.replace("-0", `-${uid}`));
    }

    $item.id = `${this.id}-${uid}`;

    return $item;
  }

  /**
   * Update all items
   * - Update ID’s to use for labelling remove button
   * - Update ARIA label to reference item’s position in list
   * - Add remove buttons (or remove if only one item remaining in list)
   */
  updateItems() {
    const $$items = this.querySelectorAll(".add-another__list-item");

    for (const [index, $item] of $$items.entries()) {
      $item.id = $item.id || `${this.id}-${index}`;
      $item.setAttribute("aria-label", `Item ${index + 1}`);

      // If no delete button, add one (if more than 1 item in list)
      // Used when initializing
      if (!this.getDeleteButton($item) && $$items.length > 1) {
        this.createDeleteButton($item);
      }

      // If has delete button
      if (this.getDeleteButton($item)) {
        if ($$items.length === 1) {
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
