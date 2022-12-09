import { Controller } from "@hotwired/stimulus";
import Tokenfield from "tokenfield";

export const TokenInputController = class extends Controller {
  static values = {
    items: String,
  };

  getTokenFieldItems = (array) => {
    return array.split(",").map((item, index) => ({
      id: index,
      name: item,
    }));
  };

  initialize() {
    const { element, itemsValue } = this;

    const tokenField = new Tokenfield({
      el: element,
      items: this.getTokenFieldItems(itemsValue),
      itemValue: "name",
      newItems: false,
    });

    // Add previously entered tokens
    if (element.value !== "") {
      tokenField.setItems(this.getTokenFieldItems(element.value));
    }

    return tokenField;
  }
};
