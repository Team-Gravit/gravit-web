import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AudioPlayerProvider } from '@/shared/ui/audio-player';

export const Route = createFileRoute('/_authenticated/_focus/interview')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AudioPlayerProvider>
      <Outlet />
    </AudioPlayerProvider>
  );
}
