import '../src/index.css';
import theme from './theme';
import { withTailwindTheme } from './decorators';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: theme,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#1A202C',
        },
      ],
    },
    layout: 'centered',
  },
  decorators: [withTailwindTheme],
};

export default preview;
