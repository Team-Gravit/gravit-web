import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { tokenManager } from '@/shared/api';

export default function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    tokenManager.clearTokens();
    queryClient.clear();
    navigate({ to: '/', replace: true });
  };
}
