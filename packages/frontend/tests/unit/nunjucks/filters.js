const test = require("ava");

const {
  absoluteUrl,
  date,
  errorList,
  markdown,
} = require("../../../lib/nunjucks/filters.js");

test("Gets absolute URL from path", (t) => {
  const result1 = absoluteUrl("path1", "https://website.example");
  const result2 = absoluteUrl("/path2", "https://website.example");
  const result3 = absoluteUrl(
    "https://website.example/path3",
    "https://website.example"
  );

  t.is(result1, "https://website.example/path1");
  t.is(result2, "https://website.example/path2");
  t.is(result3, "https://website.example/path3");
});

test("Formats a date", (t) => {
  t.is(date("2019-11-30", "dd MMMM yyyy"), "30 November 2019");
});

test("Formats the date right now", (t) => {
  const now = Math.round(Date.now() / 1_000_000);

  const result = Math.round(date("now", "t") / 1000);

  t.is(result, now);
});

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

test("Renders Markdown string as HTML", (t) => {
  t.is(markdown("**bold**"), "<p><strong>bold</strong></p>\n");
  t.is(markdown("**bold**", "inline"), "<strong>bold</strong>");
});
