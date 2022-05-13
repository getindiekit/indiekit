import test from "ava";
import { setupPrompts } from "../../lib/setup-prompts.js";

test("Gets plug-in installation prompts", (t) => {
  t.is(setupPrompts[0].message, "What is your website’s URL?");
});

test("Asks for a valid URL", (t) => {
  t.is(
    setupPrompts[0].validate("foo.bar"),
    "Enter a valid URL, for example, https://website.example"
  );
  t.true(setupPrompts[0].validate("https://foo.bar"));
});
