/** @type {import("stylelint").Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    'block-no-empty': true,
    'no-empty-source': null,
    'media-feature-range-notation': 'prefix',
  },
};
