import { getTierIconByName } from '@/entities/league';
import type { LastSeasonPopupDto } from '@/shared/api/generated/model';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

import { ModalStatBox } from './modal-stat-box';
import { ModalTierBadge } from './modal-tier-badge';

export interface SeasonResultModalProps {
  popup: LastSeasonPopupDto;
  open: boolean;
  onNext: () => void;
}

/** 지난 시즌 결과 모달. 모바일=흰 카드, 데스크톱=우주 배경 full-screen + 글래스 카드. */
export function SeasonResultModal({ popup, open, onNext }: SeasonResultModalProps) {
  const isWide = useIsWideViewport();
  const TierIcon = getTierIconByName(popup.leagueName);

  const stats = (
    <>
      <ModalStatBox value={(popup.finalLp ?? 0).toLocaleString()} label="최종 LP" />
      <ModalStatBox value={`${popup.rank ?? 0}위`} label="최종 순위" />
    </>
  );

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
              시즌 종료!
            </ModalTitle>
            <div className="flex w-74 flex-col items-center gap-4">
              <ModalTierBadge icon={TierIcon} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[16px] text-text-4">최종티어</span>
                <span className="text-[32px] font-bold text-text-1-w">{popup.leagueName}</span>
              </div>
            </div>
            <ModalDescription className="text-[18px] font-semibold text-text-2-w">
              다음 시즌도 지금처럼 진행해주세요!
            </ModalDescription>
            <div className="grid h-23 w-full grid-cols-2 gap-3">{stats}</div>
          </div>
          <Button size="cta" onClick={onNext}>
            다음으로
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-12.5">
            <div className="flex flex-col items-center gap-2">
              <ModalTitle>시즌 종료!</ModalTitle>
              <ModalDescription>이번 시즌도 수고했어요.</ModalDescription>
            </div>
            <div className="flex flex-col items-center gap-4">
              <ModalTierBadge icon={TierIcon} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-caption1 text-text-4">최종티어</span>
                <span className="text-heading1 text-text-1">{popup.leagueName}</span>
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-3">{stats}</div>
          <Button size="cta" onClick={onNext}>
            다음으로
          </Button>
        </div>
      )}
    </Modal>
  );
}
