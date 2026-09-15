# MAIN-01 메인

## 1. 화면 개요

| 항목      | 내용                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------- |
| 화면 ID   | `MAIN-01` (WEB `13750:65724` · MOB `13750:50580`). 옛 표기 `M.1.1`                                       |
| 화면명    | 메인                                                                                                     |
| 형태      | 라우트 화면. 히어로 + 카드 섹션. 넓은 화면은 상단 유리 헤더 + 2단, 좁은 화면은 1단 + 하단 탭바           |
| 경로      | `/main`                                                                                                  |
| 진입 화면 | `/`(세션 있음) · OAuth 콜백(`isOnboarded`) · `/onboarding/success` 「홈으로」                            |
| 다음 화면 | `/learning` · `/learning/$chapterId/$unitId` · `/league` · `/my` · `/my/friends/search` · `/` (로그아웃) |

로그인한 사용자가 오늘 할 것(이어서 학습 · 미션)과 현재 상태(레벨 · 티어 · 연속 학습일)를 한눈에 본다.

## 2. 근거 자료

- 최신 기능 명세 기준일: 2026년 9월 11일 (Figma Dev Mode 확인분)
- Figma 화면 — 파일 `hu4c6qCEMB62qHXk2v8Gsl` · `Screen Design` › `SCREEN` › `MAIN`(`13769:18817`)
  - `MAIN-01-WEB` `13750:65724` · `MAIN-01-MOB` `13750:50580` — 상태 프레임 없음
- 라우트: [`/_authenticated/_app-shell/main`](../../../apps/web/src/app/routes/_authenticated/_app-shell/main.tsx)
- 화면: [`pages/main`](../../../apps/web/src/pages/main/) → widgets 8개
- 생성 API 근거: [`mainpage-api.ts`](../../../apps/web/src/shared/api/generated/mainpage-api/mainpage-api.ts) 6종 + `user-api.ts` `getUser`
- 이전 기준선·시안 대조·ADR: [`MIG-025 spec.md`](../../../work/in-progress/MIG-025-메인-화면-이전/spec.md)
- 라우트 정본: [`docs/routes.md`](../../routes.md)

## 3. 기능 명세

| 구분   | 기능 ID     | 기능명                    | 설명                                                                                                                                                                                                                                                                                             | 참고                                                | 우선순위 | 상태 | 완료 | 제외 | 수정일          |
| ------ | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------- | ---- | ---- | ---- | --------------- |
| 공통   | MAIN-01-F01 | 화면 폭 분기              | • `min-width: 768px` 이면 넓은 화면(유리 헤더 · 2단), 미만이면 좁은 화면(LV·티어 헤더 · 1단 · 탭바)<br>• 두 헤더는 함께 마운트되지 않는다                                                                                                                                                        | `useIsWideViewport`                                 | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 공통   | MAIN-01-F02 | 섹션 독립성               | • 섹션 6개가 각자 조회·로딩·실패한다<br>• 실패한 섹션만 「{섹션}을/를 불러오지 못했어요.」 + 「다시 시도」, 재시도는 그 섹션만 1회                                                                                                                                                               | 동작 계약 C2·C3                                     | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 공통   | MAIN-01-F03 | 로딩                      | • 카드 헤더는 유지, 본문만 스켈레톤(`aria-busy`)                                                                                                                                                                                                                                                 |                                                     | P1       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 헤더   | MAIN-01-F04 | 넓은 화면 헤더            | • 로고 · 네비 4(홈 `/main` 학습 `/learning` 리그 `/league` 마이그래빗 `/my`) · 아바타 · 「로그아웃」<br>• 현재 경로 밑줄(`aria-current`)<br>• 로그아웃은 프로필 실패와 무관하게 항상                                                                                                             | 벨 · AI면접 미구현                                  | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 헤더   | MAIN-01-F05 | 좁은 화면 헤더            | • 아바타 + 「LV n」 · 티어 아이콘 + `leagueName`<br>• 각 항목은 독립 조회, 없으면 자리 비움                                                                                                                                                                                                      | legacy 없던 신규 · 벨 미구현                        | P1       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 헤더   | MAIN-01-F06 | 하단 탭바                 | • 홈 · 학습 · 리그 · 마이그래빗, 활성은 채운 아이콘 + `cta` 색                                                                                                                                                                                                                                   |                                                     | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 헤더   | MAIN-01-F07 | 로그아웃                  | • 세션 · Query 캐시를 비우고 `/`로                                                                                                                                                                                                                                                               | 동작 계약 C7                                        | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 히어로 | MAIN-01-F08 | 인사말                    | • 「어서오세요, {닉네임}님!」 · 「그래빗과 함께 CS 지식을 마스터해요!」<br>• 조회 실패 시 「어서오세요, 」만 (에러 UI 없음)                                                                                                                                                                      | `/main-pages/profile`                               | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 성장   | MAIN-01-F09 | 성장 현황 (넓은)          | • 아바타 · 닉네임 · 「LV n」 · 「{cur} / {max} XP」 게이지<br>• 티어 아이콘 · `leagueName` · 「{cur} / {max} LP」 게이지<br>• 둘 중 하나 실패 → 카드 전체 에러, 재시도는 실패한 쪽만                                                                                                             | `/main-pages/profile` + `league`                    | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 학습   | MAIN-01-F10 | 이어서 학습하기           | • 최근 챕터 제목 + 「{rate}%」 게이지<br>• 유닛 행: 「Unit NN」 \| 제목 \| 칩(학습 완료 / 학습 중 / 잠김) — `status` enum<br>• 목록 높이 고정, 넘치면 스크롤<br>• CTA 「{N}강 이어서 학습하기」 → 완료되지 않은 첫 유닛. 전부 완료면 없음<br>• 넓은·좁은 화면 모두 헤더에 「전체 학습화면 보기」 | `/main-pages/learning` · NN·N은 목록 순번(확인 A)   | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 학습   | MAIN-01-F11 | 최근 학습 (좁은)          | • 최근 챕터 첫 유닛 카드 1장 (「새 주제 시작하기」 라벨 · 제목 · Lesson NN · 행성)<br>• 유닛 없으면 안 그림                                                                                                                                                                                      | F10과 캐시 공유                                     | P1       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 학습   | MAIN-01-F12 | 새 주제 시작하기 (넓은)   | • 추천 유닛 카드 2열. 제목 = `chapterTitle`(확인 B) · 「Lesson {unitId}」 · 행성(`chapterId` 1~8)<br>• 「전체보기」 → `/learning`                                                                                                                                                                | `/main-pages/units`                                 | P1       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 학습   | MAIN-01-F13 | 학습 기록 없음            | • `learning` · `weekly-record` 404 → 「아직 학습 기록이 없어요.」 + 「학습 시작하기」 (재시도 없음)                                                                                                                                                                                              | **문구 임시** — 시안 없음                           | P1       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 연속   | MAIN-01-F14 | 연속 학습일               | • 「{n}」 「일 연속」 · 요일 뱃지 7 (오늘=채움 / 이전+완료=테두리 / 그 외=회색, 월요일 시작 · 서버 KST 기준 `dayTiming`)<br>• 「자세히 보기」 → `/league`                                                                                                                                        | `/main-pages/weekly-record`                         | P0       | 완료 | ☑   | ☐    | 2026년 9월 16일 |
| 미션   | MAIN-01-F15 | 오늘의 미션               | • 설명 · 「완료 시 +{xp} XP」 · 「진행률」 「{p}%」 게이지<br>• 넓은: CTA 「도전하러 가기」 / 좁은: 카드 전체 링크<br>• 목적지: `FOLLOW_NEW_FRIEND` → `/my/friends/search`, 그 외 `/learning`<br>• 완료: CTA 비활성 「미션 완료」 / 카드 링크 없음                                               | `/main-pages/mission` · `progressRate` ×100(확인 D) | P0       | 완료 | ☑   | ☐    | 2026년 9월 11일 |
| 미션   | MAIN-01-F16 | 미션 유닛 목록 (WEB 시안) | • 시안에만 있고 API에 없다                                                                                                                                                                                                                                                                       | 백엔드 확인 후 별도 작업                            | P2       | 제외 | ☐    | ☑   | 2026년 9월 11일 |
| 헤더   | MAIN-01-F17 | 알림 벨 · AI면접          | • 시안에만 있다                                                                                                                                                                                                                                                                                  | `FEAT-` 별도                                        | P2       | 제외 | ☐    | ☑   | 2026년 9월 11일 |

## 4. 라우트 및 화면 이동

```
/ (세션) · OAuth 콜백 · /onboarding/success
  └─ /main
       ├─ 헤더·탭바 → /learning · /league · /my
       ├─ 이어서 학습하기 · 전체 학습화면 보기 · 유닛 카드 → /learning/$chapterId/$unitId
       ├─ 새 주제 전체보기 · 학습 시작하기 → /learning
       ├─ 연속 학습일 자세히 보기 → /league
       ├─ 미션 → /learning | /my/friends/search
       └─ 로그아웃 → /
```

목적지 화면은 자리 라우트(`component: () => null`)다. 각 화면 이전 작업에서 채운다.

## 5. 요청

| 엔드포인트 (GET)                   | 쓰는 곳                        | 넓은 | 좁은 |
| ---------------------------------- | ------------------------------ | :--: | :--: |
| `/api/v1/users`                    | 넓은 헤더 아바타               |  ✅  |  —   |
| `/api/v1/main-pages/profile`       | 인사말 · 성장 현황 · 좁은 헤더 |  ✅  |  ✅  |
| `/api/v1/main-pages/league`        | 성장 현황 · 좁은 헤더          |  ✅  |  ✅  |
| `/api/v1/main-pages/learning`      | 이어서 학습하기 · 최근 학습    |  ✅  |  ✅  |
| `/api/v1/main-pages/units`         | 새 주제 시작하기               |  ✅  |  —   |
| `/api/v1/main-pages/weekly-record` | 연속 학습일                    |  ✅  |  ✅  |
| `/api/v1/main-pages/mission`       | 오늘의 미션                    |  ✅  |  ✅  |

전부 병렬 · 각 1회. 프로필 수정 후에는 `/users`와 `/main-pages/profile` 캐시를 **둘 다** 무효화한다.

## 6. 검증 기준

[`MIG-025 spec.md`](../../../work/in-progress/MIG-025-메인-화면-이전/spec.md) 「확정 명세 · 검증 기준」 AC-1~24. 전부 테스트로 고정
(`pages/main/ui/main-page.test.tsx` · 각 widget/entity 테스트).

### 확인 필요 (실서버 응답으로 닫는다)

| #   | 항목                  | 현재 가정             | 바꿀 곳                                                                            |
| --- | --------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| A   | 「Unit NN」 · 「N강」 | 목록 순번             | `entities/learning/model/unit-progress.ts`                                         |
| B   | 추천 카드 제목        | `chapterTitle`        | `widgets/recommended-units/ui/recommended-units.tsx`                               |
| C   | 404 빈 상태 문구      | legacy 문구 임시      | 시안 확정 시 `learning-streak` · `continue-learning-card`                          |
| D   | `progressRate` 단위   | 미션 0~1 · 챕터 0~100 | `entities/mission/model/mission.ts` · `entities/learning/model/recent-learning.ts` |
| E   | 탭바 비활성 색        | `text-3` (토큰 없음)  | `widgets/bottom-tab-bar`                                                           |
