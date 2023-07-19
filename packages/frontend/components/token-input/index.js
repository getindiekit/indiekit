import { Controller } from "@hotwired/stimulus";
import Tokenfield from "tokenfield";
import { focusableElements } from "../../lib/utils/focusable-elements.js";

export const TokenInputController = class extends Controller {
  static values = {
    items: String,
  };

  getTokenFieldItems = (string) => {
    return (
      string &&
      string.split(",").map((item, index) => ({
        id: index,
        name: item,
      }))
    );
  };

  initialize() {
    const { element } = this;

    const tokenFieldInput = element.querySelector(".input");

    const tokenField = new Tokenfield({
      el: tokenFieldInput,
      items: this.getTokenFieldItems(tokenFieldInput.dataset.items),
      itemValue: "name",
      newItems: true,
    });

    // Add previously entered tokens
    if (element.value !== "") {
      tokenField.setItems(this.getTokenFieldItems(tokenFieldInput.value));
    }

    tokenField.onInput = (value, event) => {
      if (event.shiftKey && event.key === "Tab") {
        focusableElements.previous.focus();
      } else if (event.key === "Tab") {
        focusableElements.next.focus();
      }

      return value;
    };

    return tokenField;
  }
};
