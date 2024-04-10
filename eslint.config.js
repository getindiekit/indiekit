import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import unicorn from "eslint-plugin-unicorn";
import webComponents from "eslint-plugin-wc";
import globals from "globals";

export default [
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  unicorn.configs["flat/recommended"],
  webComponents.configs["flat/recommended"],
  {
    ignores: ["**/.cache/", "_site", "docs/.vitepress/config.js"],
  },
  {
    files: ["**/{packages,helpers}/**/*.js"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "jsdoc/no-undefined-types": [1, { definedTypes: ["NodeJS"] }] },
  },
  {
    files: ["**/frontend/**/*.js"],
    languageOptions: { globals: { ...globals.browser } },
    rules: { "wc/no-self-class": "warn" },
  },
  {
    files: ["**/test/**/*.js"],
    rules: { "unicorn/no-process-exit": 0 },
  },
  prettier,
];
