import '@/app/styles/index.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { router } from './app/router';
import { setAuthFailureHandler } from './shared/api/config';
import { queryClient } from './shared/lib/query-client';
import { ToastContainer } from './shared/ui/toast';

setAuthFailureHandler(() => {
  queryClient.clear();
  router.navigate({ to: '/', replace: true });
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
