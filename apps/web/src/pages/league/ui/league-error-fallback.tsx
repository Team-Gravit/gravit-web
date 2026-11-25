import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';

import leagueLoadFailedMascot from './assets/league-load-failed-mascot.webp';

const FAILURE_MESSAGE = '리그 정보를 불러오지 못했어요.';
const RETRY_FAILURE_TOAST = '다시 시도에 실패했어요. 잠시 후 다시 시도해 주세요.';

export interface LeagueErrorFallbackProps {
  /** 거부되면 실패로 보고 토스트를 띄운다. 리그 홈·프로필을 refetch({ throwOnError: true })로 다시 받는다. */
  onRetry: () => Promise<unknown>;
}

/**
 * 리그 데이터 조회 실패 시 페이지 전체에 띄우는 폴백.
 *
 * 어두운 리그 배경에 맞춰 밝은(-w) 텍스트를 쓴다. 전체 페이지 에러 폴백이 지금은 리그에만 있어
 * 공용 컴포넌트 대신 여기 직접 둔다 — 다른 화면에서도 필요해지면 shared로 올린다.
 */
export function LeagueErrorFallback({ onRetry }: LeagueErrorFallbackProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  async function handleRetry() {
    setIsRetrying(true);
    try {
      await onRetry();
    } catch {
      toast(RETRY_FAILURE_TOAST);
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[400px] flex-1 flex-col items-center justify-center gap-4 px-4 text-center md:gap-6">
      <img src={leagueLoadFailedMascot} alt="" decoding="async" className="w-24 md:w-40" />
      <p className="text-headline2 text-text-2-w md:text-heading1">{FAILURE_MESSAGE}</p>
      <Button type="button" size="cta" isLoading={isRetrying} onClick={() => void handleRetry()}>
        다시 시도
      </Button>
    </div>
  );
}
