const path = require("path");

module.exports = {
  assetsPath: path.join(__dirname, "assets"),
  templates: require("./lib/nunjucks.js"),
  styles: require("./lib/postcss.js"),
};
