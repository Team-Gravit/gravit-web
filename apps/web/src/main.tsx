import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { QueryProvider } from '@/app/query/query-provider';
import { router } from '@/app/router/router';
import '@/app/styles/index.css';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Root element #app was not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
);
