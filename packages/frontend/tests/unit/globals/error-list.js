import test from "ava";
import { errorList } from "../../../lib/globals/index.js";

test("Transforms errors provided by express-validator", (t) => {
  const result = errorList({
    me: {
      value: "foo",
      msg: "Enter a valid URL",
      path: "fooBar[0].url",
      location: "body",
    },
  });

  t.is(result[0].href, "#foo-bar-0-url");
  t.is(result[0].text, "Enter a valid URL");
});
