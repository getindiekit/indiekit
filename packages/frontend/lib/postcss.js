import fs from "node:fs";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssCustomMedia from "postcss-custom-media";
import postcssEasyImport from "postcss-easy-import";
import postcssExtendRule from "postcss-extend-rule";

export const styles = async () => {
  const options = {
    from: fileURLToPath(new URL("../styles/app.css", import.meta.url)),
    plugins: [postcssEasyImport, postcssCustomMedia, postcssExtendRule],
  };

  const css = fs.readFileSync(options.from, "utf8");

  const result = await postcss(options.plugins).process(css, options);
  return result.css;
};
