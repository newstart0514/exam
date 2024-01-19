module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vital", "eslint:recommended", "@nuxtjs", "prettier"],
  rules: {
    "prettier/prettier": "error",
  },
  plugins: ["prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
};
