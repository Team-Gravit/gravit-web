import { Icon, LinearTimerIcon } from '@/shared/ui/icon';

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

      <div className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0px_0px_15px_rgba(0,0,0,0.2)] md:gap-4 md:rounded-full md:bg-white/40 md:px-6 md:py-4 md:shadow-none">
        <Icon icon={LinearTimerIcon} size={40} className="hidden text-text-1-w md:block" />
        <span className="text-label1 text-text-2 md:font-mbc md:text-[40px] md:text-text-1-w md:min-w-105 text-center">
          <TabularTime value={remaining} />
        </span>
      </div>
    </div>
  );
}

/**
 * 시간 문자열의 숫자 묶음을 고정 폭 박스에 가운데 정렬로 넣어, 폰트와 무관하게 전체 폭을 고정한다.
 * MBC는 tabular 숫자를 지원하지 않아, 매초 숫자가 바뀌면 폭이 흔들리기 때문이다.
 */
function TabularTime({ value }: { value: string }) {
  // 숫자 묶음(\d+)과 라벨(일·시간·분·초)로 쪼갠 뒤, 숫자만 고정 폭 박스로 감싼다.
  return (
    <>
      {value.split(/(\d+)/).map((part, index) =>
        /^\d+$/.test(part) ? (
          <span key={index} className="inline-block w-[1.3em] text-center">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
