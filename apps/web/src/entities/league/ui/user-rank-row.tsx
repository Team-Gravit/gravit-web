import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import type { LeagueUser } from '../model/types';
import { LevelProgressAvatar } from './level-progress-avatar';

export interface UserRankRowProps {
  user: LeagueUser;
  className?: string;
}

/**
 * 랭킹 리스트의 한 행. 표시 전용. 강조는 hover로만 준다.
 *
 * 모바일: 글래스 카드, 아바타 링 없음(38), 짧은 divider, LP→LV, 값 purple-300.
 * 데스크톱: h-84 핑크/10 테두리 + white/20 좌블록(순위 purple-200·닉 흰 MBC·아바타 링 56) +
 * #fef1ff/25 우블록(LV→LP·값 purple-200). hover 시 흰 배경 + main 테두리 + 핑크 글로우 +
 * 순위·값 앰버(#f9a825)·닉 다크. (get_design_context 12899:41425 / 12356:27636 / 12356:27678 기준)
 */
export function UserRankRow({ user, className }: UserRankRowProps) {
  const isWide = useIsWideViewport();

  return (
    <div
      className={cn(
        'group relative flex items-center rounded-8 shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] transition-all',
        'bg-[linear-gradient(150deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_100%)] backdrop-blur-xs',
        // 모바일: 글래스 그라디언트 테두리(::after). 데스크톱: 솔리드 테두리로 대체(::after 숨김).
        'glass-morphism-border after:rounded-8 md:after:hidden',
        'md:h-21 md:gap-0 md:border-[1.482px] md:border-[rgba(255,193,252,0.1)] md:bg-none md:pr-0 md:shadow-none',
        // hover: 흰 배경 + main 테두리 + 핑크 글로우 + 확대(시안 620→700 ≈ 1.13, 우측 패딩 확대분 포함).
        'md:hover:scale-[1.06] md:hover:border-main md:hover:bg-white md:hover:shadow-[0px_0px_6px_#f479ff]',
        className,
      )}
    >
      {/* 좌측: 순위 + 프로필 + 닉네임 (데스크톱에서 white/20 blur 블록) */}
      <div className="flex min-w-0 flex-1  items-center gap-4 md:h-full md:gap-0 md:rounded-l-8 md:bg-white/20 md:backdrop-blur-[15px]">
        <div className="flex items-center justify-center self-stretch rounded-l-8 bg-purple-100/50 px-4 md:w-26.5 md:rounded-l-none md:bg-transparent md:px-0">
          <span className="w-10 text-center font-mbc text-[20px] text-cta-text md:w-auto md:text-[28px] md:text-purple-200 md:group-hover:text-[#f9a825]">
            {String(user.rank).padStart(3, '0')}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 border-r my-3 border-text-2-w md:h-full md:border-0">
          <LevelProgressAvatar
            xp={user.xp}
            profileImgNumber={user.profileImgNumber}
            size={isWide ? 56 : 38}
            showRing={isWide}
          />
          <span className="min-w-0 truncate text-label1 text-cta-text md:text-[28px] md:font-mbc md:text-text-1-w md:group-hover:text-text-1">
            {user.nickname}
          </span>
        </div>
      </div>

      {/* 우측: LP / LV (모바일 LP→LV, 데스크톱 col-reverse 로 LV→LP) */}
      <div className="flex px-4 min-w-20 flex-col items-start gap-1 md:h-full md:min-w-32 md:flex-col-reverse justify-center md:gap-1.5 md:rounded-r-8 md:bg-[rgba(254,241,255,0.25)] md:px-6 md:backdrop-blur-2xl md:group-hover:bg-[#fef1ff] md:group-hover:px-12">
        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-caption1 text-text-2-w md:text-heading1 md:text-text-1-w md:group-hover:text-[#a8a8a8]">
            LP
          </span>
          <span className="text-label1 text-purple-300 md:text-heading1 md:text-purple-200 md:group-hover:text-semantic-warning">
            {user.lp}
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-caption1 text-text-2-w md:text-heading1 md:text-text-1-w md:group-hover:text-[#a8a8a8]">
            LV
          </span>
          <span className="text-label1 text-purple-300 md:text-heading1 md:text-purple-200 md:group-hover:text-semantic-warning">
            {user.level}
          </span>
        </div>
      </div>
    </div>
  );
}
