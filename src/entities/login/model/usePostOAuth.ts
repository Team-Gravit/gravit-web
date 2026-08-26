import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import type { AxiosError } from 'axios';

import { api } from '@/shared/api';
import type { AuthCodeRequest } from '@/shared/api/@generated';
import { tokenManager } from '@/shared/api/config';
import { toast } from '@/shared/lib/toast';

export function usePostOAuth() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      provider,
      dest,
      code,
    }: AuthCodeRequest & { dest: string; provider: string }) => {
      const response = await api.public.oAuth.oauthLogin(provider, dest, {
        code,
      });
      return response.data;
    },
    retry: false,
    onSuccess: (data) => {
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      router.navigate({ to: data.isOnboarded ? '/main' : '/onboarding', replace: true });
    },
    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const { error: errorCode, message } = error.response.data as {
          error: string;
          message: string;
        };
        if (errorCode === 'USER_423') {
          router.navigate({
            to: '/restore',
            search: {
              providerId: message,
            },
          });
        } else {
          toast.error(message);
        }
      }
    },
  });
}
