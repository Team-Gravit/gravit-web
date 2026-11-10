import type { QueryClient } from '@tanstack/react-query';
import {
  ErrorComponent,
  createFileRoute,
  redirect,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';

import {
  UserCheckFailedError,
  getOnboardingRedirect,
  isUserNotFoundError,
} from '@/app/auth/onboarding-gate';
import { SessionGuard } from '@/app/auth/session-guard';
import { clearSession, getSessionToken, restoreSession } from '@/entities/auth';
import { getUserQueryOptions } from '@/entities/user';
import { SessionCheckError, SessionCheckPending } from '@/pages/session-check';

async function loadUser(queryClient: QueryClient) {
  try {
    // 헤더가 없는 풀이 화면에 5분 넘게 머물면 기본 gcTime으로 캐시가 지워져, 제출 뒤 이동이 재조회에 막힌다.
    // 세션이 끝나면 query-client.ts가 캐시를 비우므로 이전 계정의 값은 남지 않는다.
    // 'static': 캐시가 있으면 오래됐어도 이동을 막지 않는다. 갱신은 화면의 useUser가 맡는다.
    return await queryClient.query({
      ...getUserQueryOptions({ query: { gcTime: Infinity } }),
      staleTime: 'static',
    });
  } catch (error) {
    // 다시 시도해도 결과가 같다. 세션을 남기면 `/`가 `/main`으로 되돌려 빠져나갈 수 없다.
    if (isUserNotFoundError(error)) {
      clearSession();
    }

    // 재발급까지 거절되면 인터셉터가 세션을 지운다. 세션이 남아 있으면 일시 장애다.
    if (!getSessionToken()) {
      throw redirect({ to: '/' });
    }

    throw new UserCheckFailedError(error);
  }
}

function AuthenticatedRouteError({ error }: ErrorComponentProps) {
  const router = useRouter();

  if (!(error instanceof UserCheckFailedError)) {
    return <ErrorComponent error={error} />;
  }

  return <SessionCheckError onRetry={() => void router.invalidate()} />;
}

function redirectByOnboarding(pathname: string, isOnboarded: boolean) {
  const destination = getOnboardingRedirect(pathname, isOnboarded);

  if (destination) {
    throw redirect({ to: destination });
  }
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    // 일시 장애면 세션 힌트가 남아 있으므로 로그인 화면으로 보내지 않고 다시 시도할 수 있게 한다.
    if ((await restoreSession()) === 'failed') {
      throw new UserCheckFailedError(new Error('세션 복원에 실패했습니다'));
    }

    if (!getSessionToken()) {
      throw redirect({ to: '/' });
    }

    // 화면 이동처럼 사용자를 이미 받았다면 화면을 그리기 전에 여기서 판정한다.
    // loader는 이동 때 백그라운드에서 다시 돌 수 있어, 판정을 loader에만 두면 잘못된 화면이 잠깐 보인다.
    const cachedUser = context.queryClient.getQueryData(getUserQueryOptions().queryKey);

    if (cachedUser) {
      redirectByOnboarding(location.pathname, cachedUser.isOnboarded);
    }
  },
  // 첫 진입의 사용자 조회는 loader에서 기다린다. beforeLoad에서 기다리면 화면 코드 청크와 화면 loader가
  // 이 응답 뒤로 밀린다. 라우터는 모든 loader가 끝난 뒤 화면을 그리므로 판정 전에 화면이 보이지 않는다. (REF-062)
  loader: async ({ context, location }) => {
    const user = await loadUser(context.queryClient);

    redirectByOnboarding(location.pathname, user.isOnboarded);
  },
  pendingComponent: SessionCheckPending,
  // 기본값 1초는 첫 진입의 빈 화면으로 길다. 빠른 응답에서 깜빡이지 않을 만큼만 기다린다.
  pendingMs: 300,
  errorComponent: AuthenticatedRouteError,
  component: SessionGuard,
});
