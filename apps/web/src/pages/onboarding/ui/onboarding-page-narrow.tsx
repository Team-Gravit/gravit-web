import { useNavigate } from '@tanstack/react-router';

import { useLogout } from '@/features/auth-logout';
import { OnboardingForm, type OnboardingFormProps } from '@/features/user-onboarding';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/layout';

const CANCEL_LABEL = '이전';

/**
 * 좁은 화면 온보딩. 상단바를 두고 조작 버튼을 화면 아래쪽에 붙인다.
 *
 * 상단바 제목이 「로그인」인 것은 시안과 legacy 가 일치한다 (기준선 A6). 온보딩은
 * 로그인 흐름의 마지막 단계라 제품이 그렇게 부르고 있다.
 */
export function OnboardingPageNarrow({ form }: Pick<OnboardingFormProps, 'form'>) {
  const navigate = useNavigate();

  // 온보딩을 취소하면 세션을 지우고 로그인 화면으로 돌아간다.
  const cancelOnboarding = useLogout({
    onSuccess: () => {
      navigate({ to: '/' });
    },
  });

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <PageHeader
        title="로그인"
        leftSlot={
          <button
            type="button"
            aria-label={CANCEL_LABEL}
            onClick={cancelOnboarding}
            className="inline-flex size-12 cursor-pointer items-center justify-center outline-none focus-visible:ring-3 focus-visible:ring-purple-200"
          >
            <Icon name="chevron-left" />
          </button>
        }
      />

      <main className="flex flex-1 flex-col px-4 pt-5">
        <OnboardingForm
          form={form}
          secondaryAction={
            <Button
              type="button"
              variant="stroke-default"
              size="cta"
              className="shrink-0 w-[26%]"
              onClick={cancelOnboarding}
            >
              {CANCEL_LABEL}
            </Button>
          }
        />
      </main>
    </div>
  );
}
