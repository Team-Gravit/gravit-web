import { useNavigate } from '@tanstack/react-router';

import { tokenManager } from '@/shared/api';
import { queryClient } from '@/shared/lib/query-client';

export default function useLogout() {
  const navigate = useNavigate();

  return () => {
    tokenManager.clearTokens();
    queryClient.clear();
    navigate({ to: '/', replace: true });
  };
}
