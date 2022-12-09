import { Controller } from "@hotwired/stimulus";
import Tokenfield from "tokenfield";

export const TokenInputController = class extends Controller {
  static values = {
    items: String,
  };

  initialize() {
    const items = this.itemsValue.split(",").map((item, index) => ({
      id: index,
      name: item,
    }));

    return new Tokenfield({
      el: this.element,
      items,
      itemValue: "name",
      newItems: false,
    });
  }
};
