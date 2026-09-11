import { useState } from 'react';

import type { LastSeasonPopupDto } from '@/shared/api/generated/model';

import { SeasonResultModal } from './season-result-modal';
import { SeasonStartModal } from './season-start-modal';

export interface LeagueSeasonModalProps {
  popup: LastSeasonPopupDto;
  /** 두 모달을 모두 확인해 흐름이 끝났을 때. */
  onComplete: () => void;
}

type Step = 'result' | 'start' | 'done';

/** 시즌 결과 → 시작 순차 모달. 결과 확인 후 시작 모달을 이어서 노출한다. */
export function LeagueSeasonModal({ popup, onComplete }: LeagueSeasonModalProps) {
  const [step, setStep] = useState<Step>('result');

  return (
    <>
      <SeasonResultModal popup={popup} open={step === 'result'} onNext={() => setStep('start')} />
      <SeasonStartModal
        popup={popup}
        open={step === 'start'}
        onNext={() => {
          setStep('done');
          onComplete();
        }}
      />
    </>
  );
}
