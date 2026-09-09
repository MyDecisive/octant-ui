/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-scss", 'stylelint-config-clean-order'],
    rules: {
    "selector-class-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|^Mui[A-Za-z0-9-]+$",
      { message: "Expected class selector to be kebab-case or a Mui* selector" }
    ],
  },
};
