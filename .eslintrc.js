module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "airbnb",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.slice.js"],
      rules: {
        "no-param-reassign": ["error", { props: false }],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    curly: ["error", "multi-line", "consistent"],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    // Add or modify this rule based on your preference
    "object-curly-newline": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-wrap-multilines": "off",
    "implicit-arrow-linebreak": "off",
    "function-paren-newline": "off",
    "comma-dangle": "off",
    "max-len": ["error", { "code": 150 }],
    "react/forbid-prop-types": "off",
  },
};
