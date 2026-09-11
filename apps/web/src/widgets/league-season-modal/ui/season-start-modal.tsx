import { getTierIconByName } from '@/entities/league';
import type { LastSeasonPopupDto } from '@/shared/api/generated/model';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

import { ModalStatBox } from './modal-stat-box';
import { ModalTierBadge } from './modal-tier-badge';

export interface SeasonStartModalProps {
  popup: LastSeasonPopupDto;
  open: boolean;
  onNext: () => void;
}

/** 새 시즌 시작 모달. 모바일=흰 카드, 데스크톱=우주 배경 full-screen + 글래스 카드. */
export function SeasonStartModal({ popup, open, onNext }: SeasonStartModalProps) {
  const isWide = useIsWideViewport();
  const TierIcon = getTierIconByName(popup.nextLeagueName);

  return (
    <Modal
      open={open}
      dismissible={false}
      surface={isWide ? 'glass' : 'card'}
      backdrop={isWide ? 'space' : 'dim'}
    >
      {isWide ? (
        <div className="flex w-full flex-col gap-8 text-center">
          <div className="flex min-h-100 flex-col items-center justify-center gap-6">
            <ModalTitle className="text-[28px] font-bold tracking-[-0.6px] text-purple-300">
              시즌 시작!
            </ModalTitle>
            <div className="flex w-74 flex-col items-center gap-4">
              <ModalTierBadge icon={TierIcon} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[16px] text-text-4">시작 티어</span>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-heading1 text-text-2-w">{popup.leagueName}</span>
                  <span className="text-text-1-w">→</span>
                  <span className="text-[32px] font-bold text-text-1-w">
                    {popup.nextLeagueName}
                  </span>
                </div>
              </div>
            </div>
            <ModalDescription className="text-[18px] font-semibold text-text-2-w">
              다음 시즌도 지금처럼 진행해주세요!
            </ModalDescription>
            <div className="grid h-23 w-full grid-cols-1">
              <ModalStatBox value={String(popup.nextStartLp ?? 0)} label="시작 LP" />
            </div>
          </div>
          <Button size="cta" onClick={onNext}>
            다음으로
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-12.5">
            <div className="flex flex-col items-center gap-2">
              <ModalTitle>시즌 시작!</ModalTitle>
              <ModalDescription>직전 티어 기준으로 시작 위치가 정해져요!</ModalDescription>
            </div>
            <div className="flex flex-col items-center gap-4">
              <ModalTierBadge icon={TierIcon} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-caption1 text-text-4">시작 티어</span>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-heading2 text-text-4">{popup.leagueName}</span>
                  <span className="text-text-1">→</span>
                  <span className="text-heading1 text-text-1">{popup.nextLeagueName}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <ModalStatBox value={String(popup.nextStartLp ?? 0)} label="시작 LP" />
          </div>
          <Button size="cta" onClick={onNext}>
            다음으로
          </Button>
        </div>
      )}
    </Modal>
  );
}
