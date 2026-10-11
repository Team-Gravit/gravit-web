import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';

/**
 * AI면접 홈 대시보드를 연결하기 전의 진입 화면.
 * 설정 시작과 설정에서 나왔을 때의 목적지로 사용한다. 대시보드 구현 시 본문을 교체한다.
 */
export function InterviewPage() {
  return (
    <main>
      <h1>AI면접</h1>
      <Button asChild>
        <Link to="/interview/new/$step" params={{ step: 'answer-type' }}>
          새 세션 시작
        </Link>
      </Button>
    </main>
  );
}
