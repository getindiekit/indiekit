import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import sortClassMembers from "eslint-plugin-sort-class-members";
import unicorn from "eslint-plugin-unicorn";
import webComponents from "eslint-plugin-wc";
import globals from "globals";

export default [
  importPlugin.flatConfigs.recommended,
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  sortClassMembers.configs["flat/recommended"],
  unicorn.configs["recommended"],
  webComponents.configs["flat/recommended"],
  {
    ignores: [
      "**/.cache/",
      "_site",
      "docs/.vitepress/config.js",
      "eslint.config.js",
    ],
  },
  {
    files: ["**/{packages,helpers}/**/*.js"],
    languageOptions: { globals: { ...globals.node }, ecmaVersion: "latest" },
    rules: {
      "import/no-named-as-default": 0,
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          "newlines-between": "always",
        },
      ],
      "jsdoc/no-undefined-types": [1, { definedTypes: ["NodeJS"] }],
      "jsdoc/require-hyphen-before-param-description": "warn",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: { utils: true },
        },
      ],
    },
  },
  {
    files: ["**/frontend/**/*.js"],
    languageOptions: { globals: { ...globals.browser } },
    rules: { "wc/no-self-class": "warn" },
  },
  {
    files: ["**/frontend/lib/serviceworker.js"],
    languageOptions: { globals: { ...globals.serviceworker } },
  },
  {
    files: ["**/test/**/*.js"],
    rules: { "unicorn/no-process-exit": 0 },
  },
  prettier,
];
