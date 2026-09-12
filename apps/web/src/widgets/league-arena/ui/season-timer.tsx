import { Icon } from '@/shared/ui/icon';

import { useRemainingTime } from '../model/use-remaining-time';

export interface SeasonTimerProps {
  seasonName: string;
}

/**
 * 시즌명과 시즌 종료까지 남은 시간을 표시한다.
 * 모바일: 흰 pill + 어두운 텍스트(아이콘 없음). 데스크톱: 제목 64px purple-200,
 * 반투명 흰 pill + 아이콘 + MBC 40px 흰 텍스트. (두 시안 get_design_context 기준)
 */
export function SeasonTimer({ seasonName }: SeasonTimerProps) {
  const remaining = useRemainingTime();

  return (
    <div className="flex flex-col items-center gap-2 md:gap-8">
      <h1 className="font-mbc text-[22px] tracking-[-0.6px] text-text-1-w md:text-[64px] md:text-purple-200">
        {seasonName}
      </h1>

      <div className="flex items-center justify-center gap-2 rounded-full  bg-white px-4 py-2 shadow-[0px_0px_15px_rgba(0,0,0,0.2)] md:gap-4 md:rounded-full md:bg-white/40 md:px-6 md:py-4 md:shadow-none">
        <Icon name="linear-timer" size={40} className="hidden text-text-1-w md:block" />
        <span className="text-label1 text-text-2 md:font-mbc md:text-[40px] md:text-text-1-w md:min-w-80 text-center">
          {remaining}
        </span>
      </div>
    </div>
  );
}
