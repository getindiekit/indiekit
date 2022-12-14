import fs from "node:fs";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssEasyImport from "postcss-easy-import";
import postcssLightningcss from "postcss-lightningcss";

export const styles = async () => {
  const options = {
    from: fileURLToPath(new URL("../styles/app.css", import.meta.url)),
    plugins: [
      postcssEasyImport,
      postcssLightningcss({
        browsers: ">= 0.5%",
        lightningcssOptions: {
          drafts: {
            customMedia: true,
            nesting: true,
          },
        },
      }),
    ],
  };

  const css = fs.readFileSync(options.from, "utf8");
  const result = await postcss(options.plugins).process(css, options);

  return result.css;
};
