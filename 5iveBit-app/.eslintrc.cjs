module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit",
    "@electron-toolkit/eslint-config-prettier"
  ],
  rules: {
    quotes: "off" // Disables the quotes rule entirely
  }
};
