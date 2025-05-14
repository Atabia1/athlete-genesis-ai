import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'Athlete GPT',
  brandUrl: 'https://github.com/your-username/athlete-gpt',
  brandTarget: '_blank',

  // UI
  appBg: '#F8F9FC',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E2E8F0',
  appBorderRadius: 6,

  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#1A202C',
  textInverseColor: '#FFFFFF',

  // Toolbar default and active colors
  barTextColor: '#718096',
  barSelectedColor: '#3182CE',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E0',
  inputTextColor: '#1A202C',
  inputBorderRadius: 4,
});
