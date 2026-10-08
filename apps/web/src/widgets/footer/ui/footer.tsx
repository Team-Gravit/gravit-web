import { Link } from '@tanstack/react-router';

import { GravitLogo } from '@/shared/ui/logo';

import appcenterLogo from './assets/logo-appcenter.png';

export function Footer() {
  return (
    // 시안 배경색(Gray Scale/Gray_700 = #666666)에 대응하는 별칭 토큰이 아직 없어
    // primitive 를 직접 참조한다. 별칭이 확정되면 교체한다 — work/to-do/FIX-009
    <footer className="w-full bg-[var(--primitive-gray-700)] pt-[50px] pb-[100px]">
      <div className="flex flex-col gap-4 px-[150px]">
        <div className="flex items-center gap-5">
          <GravitLogo variant="mono" className="h-9 w-auto text-text-1-w" />
          <span aria-hidden="true" className="h-10 w-0 border-l border-divider-2" />
          <img src={appcenterLogo} alt="앱센터 로고" className="h-9 w-auto" />
        </div>

        <hr className="w-full border-white/45" />

        <div className="flex items-end text-body1-normal">
          <div className="flex flex-1 flex-col gap-3">
            <address className="flex items-start gap-5 not-italic">
              <dl className="contents">
                <div className="flex flex-col gap-3 text-text-1-w">
                  <dt>주소</dt>
                  <dt>문의 메일</dt>
                </div>
                <div className="flex flex-col gap-3 text-text-1-w/58">
                  <dd>인천광역시 연수구 아카데미로 119 정보전산원 앱센터</dd>
                  <dd>
                    <a href="mailto:ahh010145@gmail.com" className="hover:underline">
                      ahh010145@gmail.com
                    </a>
                  </dd>
                </div>
              </dl>
            </address>

            <p className="text-text-1-w/80">Powered by INU Appcenter</p>
          </div>

          <p className="shrink-0 text-right whitespace-nowrap text-text-1-w/58">
            Copyright 2026. Gravit! All rights reserved.
          </p>
        </div>

        <hr className="w-full border-white/45" />

        {/* 시안에 없는 요소 */}
        <nav className="flex gap-4 text-body1-normal text-text-1-w/58">
          <Link to="/privacy" className="hover:text-text-1-w hover:underline">
            개인정보 처리방침
          </Link>
          <span aria-hidden="true">|</span>
          <Link to="/terms" className="hover:text-text-1-w hover:underline">
            서비스 이용약관
          </Link>
        </nav>
      </div>
    </footer>
  );
}
