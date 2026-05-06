/// <reference types="vite/client" />
import '../src/app/styles/globals.css'
import type { Preview } from '@storybook/react-vite'
import { withTanstackRouter } from '../src/shared/lib/test/with-router';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    withTanstackRouter({ routeId: "/" }),
  ],
};

export default preview;