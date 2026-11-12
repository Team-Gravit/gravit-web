import type { ReactNode } from 'react';

import { Footer } from '@/widgets/footer';

interface WithdrawStatusLayoutProps {
  /** 중앙 마스코트 이미지 경로. 장식이므로 alt는 비운다. */
  mascotSrc: string;
  /** 제목 문구. */
  title: string;
  /** 본문 안내 문구. 줄바꿈이 있어 ReactNode로 받는다. */
  description: ReactNode;
}

/**
 * 탈퇴 플로우의 전체화면 안내 레이아웃(마스코트 + 제목 + 설명).
 * 결과(성공/실패)와 메일 발송 안내가 구조가 같아 공유한다. 데스크톱은 하단에 Footer.
 */
export function WithdrawStatusLayout({ mascotSrc, title, description }: WithdrawStatusLayoutProps) {
  return (
    <>
      <main className="bg-bg-0 md:bg-bg-2 flex min-h-screen flex-col items-center justify-between text-center px-4 pt-5 pb-safe-5 md:p-0">
        <div className="flex-1 flex items-center justify-center flex-col w-full md:w-auto">
          <img src={mascotSrc} alt="" className="w-36.5 md:w-50 mx-auto" />
          <h1 className="text-heading1 md:text-title3 text-text-1 mt-10 md:mt-8 mb-2 md:mb-3">
            {title}
          </h1>
          <p className="text-body2-normal md:text-headline1 text-text-4">{description}</p>
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
