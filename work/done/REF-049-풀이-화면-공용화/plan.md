---
id: 'REF-049'
planned: '2026-10-05'
mode: 'refactor'
---

# REF-049 구현 계획

> 승인: 2026-10-05 (`MIG-048/plan.md` §1 과 함께 승인). 상세 근거와 이전 매핑은 그 문서 §1 에 있다.

## 체크리스트

- [x] `[features]` `quiz-session-storage` 키를 `QuizSessionKey = number | string` 으로 — 같은 문자열 키를 만든다
- [x] `[features]` `QuizSessionProvider` `lessonId` → `sessionKey`. `AdvanceAction` `'submitLesson'` → `'finish'`
- [x] `[widgets]` `quiz-screen` 신설 — `QuizScreen`(상단바 · 진행 패널 · 타이머 · 문제 카드 · 하단 · 덮개) · `LoadingScreen`. 상단바·타이머·로딩·에셋은 `git mv`
- [x] `[pages]` `lesson-quiz-page.tsx` — 조회 · 상태 화면 · Provider · 일괄 제출 · 결과 이동 · 북마크 연결만 남긴다
- [x] 검증 — lint · check-types · test · build. 라우트 파일·트리 변경 없음
