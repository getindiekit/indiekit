import importPlugin from "eslint-plugin-import-x";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import unicorn from "eslint-plugin-unicorn";
import * as webComponents from "eslint-plugin-wc";
import globals from "globals";

export default [
  {
    ...importPlugin.flatConfigs.recommended,
    settings: {
      "import-x/resolver-next": [importPlugin.createNodeResolver()],
    },
  },
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
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
      "import-x/no-named-as-default": 0,
      "import-x/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          "newlines-between": "always",
        },
      ],
      "jsdoc/no-undefined-types": [1, { definedTypes: ["NodeJS"] }],
      "jsdoc/require-hyphen-before-param-description": "warn",
      "unicorn/comment-content": "off",
      "unicorn/consistent-optional-chaining": "off",
      "unicorn/no-incorrect-template-string-interpolation": "off",
      "unicorn/no-unreadable-new-expression": "off",
      "unicorn/no-unsafe-buffer-conversion": "off",
      "unicorn/no-unsafe-string-replacement": "off",
      "unicorn/prefer-array-from-map": "off",
      "unicorn/prefer-continue": "off",
      "unicorn/prefer-iterator-to-array": "off",
      "unicorn/prefer-minimal-ternary": "off",
      "unicorn/prefer-private-class-fields": "off",
      "unicorn/prefer-scoped-selector": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/prefer-uint8array-base64": "off",
      "unicorn/name-replacements": [
        "error",
        {
          allowList: { application: true, utils: true },
          replacements: { application: false },
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
