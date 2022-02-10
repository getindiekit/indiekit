const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const postcssEasyImport = require("postcss-easy-import");
const postcssExtendRule = require("postcss-extend-rule");

module.exports = (async () => {
  const options = {
    from: path.join(__dirname, "..", "styles/app.css"),
    plugins: [postcssEasyImport, postcssExtendRule],
  };

  const css = fs.readFileSync(options.from, "utf8");

  const result = await postcss(options.plugins).process(css, options);
  return result.css;
})();
