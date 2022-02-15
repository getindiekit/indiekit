const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

module.exports = (async () => {
  const options = {
    from: path.join(__dirname, "..", "styles/app.css"),
    plugins: [
      require("postcss-easy-import"),
      require("postcss-custom-media"),
      require("postcss-extend-rule"),
    ],
  };

  const css = fs.readFileSync(options.from, "utf8");

  const result = await postcss(options.plugins).process(css, options);
  return result.css;
})();
