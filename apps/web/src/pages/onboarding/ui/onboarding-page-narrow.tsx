import { OnboardingForm, type OnboardingFormProps } from '@/features/user-onboarding';
import { ChevronLeftIcon, Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/layout';

import { ONBOARDING_CANCEL_LABEL, OnboardingCancelButton } from './onboarding-cancel-button';

export interface OnboardingPageNarrowProps extends Pick<OnboardingFormProps, 'form'> {
  onCancel: () => void;
}

/**
 * 좁은 화면 온보딩. 상단바를 두고 조작 버튼을 화면 아래쪽에 붙인다.
 *
 * 상단바 제목이 「로그인」인 것은 시안과 legacy 가 일치한다 (기준선 A6). 온보딩은
 * 로그인 흐름의 마지막 단계라 제품이 그렇게 부르고 있다.
 */
export function OnboardingPageNarrow({ form, onCancel }: OnboardingPageNarrowProps) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <PageHeader
        title="로그인"
        leftSlot={
          <button
            type="button"
            aria-label={ONBOARDING_CANCEL_LABEL}
            onClick={onCancel}
            className="inline-flex size-12 cursor-pointer items-center justify-center outline-none focus-visible:ring-3 focus-visible:ring-purple-200"
          >
            <Icon icon={ChevronLeftIcon} />
          </button>
        }
      />

      <main className="flex flex-1 flex-col px-4 pt-5 pb-safe-0">
        <OnboardingForm
          form={form}
          secondaryAction={<OnboardingCancelButton onCancel={onCancel} />}
        />
      </main>
    </div>
  );
}
