import type { Preview } from '@storybook/react-vite';

import '../src/app/styles/index.css';
import { RESPONSIVE_VIEWPORTS } from './viewports';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    viewport: {
      options: RESPONSIVE_VIEWPORTS,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
