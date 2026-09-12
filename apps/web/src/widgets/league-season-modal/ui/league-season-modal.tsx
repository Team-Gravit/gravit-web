import { useState } from 'react';
import type { ReactNode } from 'react';

import type { LastSeasonPopupDto } from '@/entities/league';
import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Button } from '@/shared/ui/button';
import { Modal, ModalDescription, ModalTitle } from '@/shared/ui/modal';

import { ModalStatBox } from './modal-stat-box';
import { ModalTierBadge } from './modal-tier-badge';

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

interface SeasonModalLayoutProps {
  open: boolean;
  /** 상단 제목(`시즌 종료!` / `시즌 시작!`). */
  title: string;
  /** 티어 배지에 표시할 티어 이름. */
  tierName: string;
  /** 티어 값 블록의 라벨(`최종티어` / `시작 티어`). */
  label: string;
  /** 라벨 아래 티어 값 표현. 결과=단일 티어, 시작=이전→새 전이라 구조가 달라 주입받는다. */
  children: ReactNode;
  /** 설명 문구. */
  description: string;
  /** 하단 stat 칸(결과=2칸, 시작=1칸). */
  stats: ReactNode;
  /** stat 그리드 열 수. stats 개수에 맞춘다(기본 2). */
  statsColumns?: 1 | 2;
  onNext: () => void;
}

/**
 * 시즌 결과·시작 모달의 공통 골격. 결과/시작이 공유하는 반응형 레이아웃(모바일=흰 카드,
 * 데스크톱=우주 배경 full-screen + 글래스 카드)을 한 곳에 둔다. 제목·티어 값·설명·stat만
 * 슬롯으로 받고, 구조가 다른 티어 값 블록은 children으로 주입받는다.
 */
function SeasonModalLayout({
  open,
  title,
  tierName,
  label,
  children,
  description,
  stats,
  statsColumns = 2,
  onNext,
}: SeasonModalLayoutProps) {
  const statsGridClass = statsColumns === 1 ? 'grid-cols-1' : 'grid-cols-2';
  const isWide = useIsWideViewport();

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
              {title}
            </ModalTitle>
            <div className="flex w-74 flex-col items-center gap-4">
              <ModalTierBadge tierName={tierName} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[16px] text-text-4">{label}</span>
                {children}
              </div>
            </div>
            <ModalDescription className="text-[18px] font-semibold text-text-2-w">
              {description}
            </ModalDescription>
            <div className={cn('grid h-23 w-full gap-3', statsGridClass)}>{stats}</div>
          </div>
          <Button size="cta" onClick={onNext}>
            다음으로
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-12.5">
            <div className="flex flex-col items-center gap-2">
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
            <div className="flex flex-col items-center gap-4">
              <ModalTierBadge tierName={tierName} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-caption1 text-text-4">{label}</span>
                {children}
              </div>
            </div>
          </div>
          <div className={cn('grid w-full gap-3', statsGridClass)}>{stats}</div>
          <Button size="cta" onClick={onNext}>
            다음으로
          </Button>
        </div>
      )}
    </Modal>
  );
}

interface SeasonModalProps {
  popup: LastSeasonPopupDto;
  open: boolean;
  onNext: () => void;
}

/** 지난 시즌 결과 모달. 최종 티어와 LP·순위를 보여준다. */
function SeasonResultModal({ popup, open, onNext }: SeasonModalProps) {
  return (
    <SeasonModalLayout
      open={open}
      title="시즌 종료!"
      tierName={popup.leagueName}
      label="최종티어"
      description="이번 시즌도 수고했어요."
      stats={
        <>
          <ModalStatBox value={(popup.finalLp ?? 0).toLocaleString()} label="최종 LP" />
          <ModalStatBox value={`${popup.rank ?? 0}위`} label="최종 순위" />
        </>
      }
      onNext={onNext}
    >
      <span className="text-heading1 text-text-1 md:text-[32px] md:font-bold md:text-text-1-w">
        {popup.leagueName}
      </span>
    </SeasonModalLayout>
  );
}

/** 새 시즌 시작 모달. 이전→새 티어 전이와 시작 LP를 보여준다. */
function SeasonStartModal({ popup, open, onNext }: SeasonModalProps) {
  return (
    <SeasonModalLayout
      open={open}
      title="시즌 시작!"
      tierName={popup.nextLeagueName}
      label="시작 티어"
      description="직전 티어 기준으로 시작 위치가 정해져요!"
      stats={<ModalStatBox value={String(popup.nextStartLp ?? 0)} label="시작 LP" />}
      statsColumns={1}
      onNext={onNext}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-heading2 text-text-4 md:text-heading1 md:text-text-2-w">
          {popup.leagueName}
        </span>
        <span className="text-text-1 md:text-text-1-w">→</span>
        <span className="text-heading1 text-text-1 md:text-[32px] md:font-bold md:text-text-1-w">
          {popup.nextLeagueName}
        </span>
      </div>
    </SeasonModalLayout>
  );
}
