import test from "ava";
import { errorList } from "../../../lib/globals/error-list.js";

test("Transforms errors provided by express-validator", (t) => {
  const errors = {
    me: {
      value: "foo",
      msg: "Enter a valid URL",
      param: "customConfigUrl",
      location: "body",
    },
  };

  const result = errorList(errors);

  t.is(result[0].href, "#custom-config-url");
  t.is(result[0].text, "Enter a valid URL");
});
