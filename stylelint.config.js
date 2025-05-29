/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'plugin',
          'custom-variant',
          'theme',
        ],
      },
    ],

    'at-rule-no-deprecated': null,

    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'declaration-block-single-line-max-declarations': null,
  },
};
