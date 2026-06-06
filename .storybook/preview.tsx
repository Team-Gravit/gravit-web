/// <reference types="vite/client" />
import '../src/app/styles/index.css';

import type { Preview } from '@storybook/react-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

import { withTanstackRouter } from '../src/shared/lib/test/with-router';
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  decorators: [withTanstackRouter({ routeId: '/' })],
};

export default preview;
