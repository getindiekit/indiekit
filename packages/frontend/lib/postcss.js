import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import postcssEasyImport from 'postcss-easy-import';
import postcssExtendRule from 'postcss-extend-rule';

export default (async () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const options = {
    from: path.join(__dirname, '..', 'styles/app.css'),
    plugins: [
      postcssEasyImport,
      postcssExtendRule
    ]
  };

  const css = fs.readFileSync(options.from, 'utf8');

  const result = await postcss(options.plugins).process(css, options);
  return result.css;
})();
