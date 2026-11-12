---
id: 'FEAT-081'
validated: '2026-11-09'
mode: 'feature'
---

# FEAT-081 검증 결과

> `ai-validate` 산출물.

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                       |
| --- | --------------- | -------------------------------------------------- | -------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ No problems found       |
| 2   | 타입            | `pnpm check-types`                                 | ✅ 통과                    |
| 3   | 테스트          | `pnpm test`                                        | ⚠️ 기존 실패 7건(범위 밖)  |
| 4   | 빌드            | `pnpm build`                                       | ✅ built                   |
| 5   | 포맷            | `pnpm format:check`                                | ✅ (작업 문서 2개 --write) |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 없음                    |

### 3번 테스트 — 기존 실패(범위 밖)

실패 7건은 전부 `concept-note` 관련 파일이다. 이번 작업 변경 파일은 `league/*`·`pages/league`
뿐이며 concept-note와 import 경로가 겹치지 않는다.

- `src/entities/concept-note/api/use-concept-note.test.tsx` (1건)
- `src/app/routes/_authenticated/_app-shell/-concept-note-route.test.tsx` (6건)

원인: `@mswjs/interceptors`/undici의 `extractBody`에서 터지는 환경성 실패. **변경을 모두 stash한
깨끗한 develop 상태에서도 동일하게 실패함을 확인**했다 → 이번 작업과 무관한 기존 실패.
`work/to-do/FIX-045-테스트-간헐-실패`로 이미 추적 중이므로 범위 밖에서 고치지 않는다.

이번 작업 테스트는 전부 통과:

- `src/entities/league/model/anchor.test.ts` (10)
- `src/pages/league/ui/league-page.test.tsx` (5)
- `src/widgets/league-arena/ui/league-arena.test.tsx` (2) 등 league 범위 24건 통과

### 5번 포맷 — 조치

`work/in-progress/FEAT-081-.../{plan,spec}.md`(이번 작업 산출물)가 걸려 `prettier --write`로 정리.
(`work/done`과 달리 `work/in-progress`는 포맷 검사 대상)

## 2. 요구사항 ↔ 구현 대조

| #    | 요구사항 (spec.md의 AC)                                          | 구현 위치                                                                                              | 상태           |
| ---- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------- |
| AC-1 | 앵커 페이지 계산 경계 (1→0,10→0,11→1,92→9,100→9,101→10)          | `entities/league/model/anchor.ts` `getAnchorPage` + `anchor.test.ts`(10 케이스 통과)                   | ✅ 테스트 고정 |
| AC-2 | 내 티어·rank=92 진입 시 내 행 중앙 + 위 80위대·아래 100위대 존재 | `use-scroll-anchor.ts`(버퍼링±1 후 `scrollIntoView(block:'center')`) + `ranking-list.tsx`(userId 매칭) | ✅ 수동 확인됨 |
| AC-3 | 위로 스크롤해 이전 페이지 로드 시 보이는 위치 유지(튐 없음)      | `use-scroll-anchor.ts` prepend 보정 `useLayoutEffect`(scrollHeight 차 보정)                            | ✅ 수동 확인됨 |
| AC-4 | 다른 티어 선택 시 센터링 없이 0페이지부터 단방향                 | `league-arena.tsx`(`myUserId={isMyTier ? … : undefined}`) + `ranking-list.tsx`(centerMode off)         | ✅ 수동 확인됨 |

> AC-2·3·4는 실제 스크롤·IntersectionObserver 레이아웃이 필요해 jsdom 자동 테스트 대상이 아니다.
> 사용자가 rank 1/37/92/100/꼴찌·티어 전환·빠른 왕복으로 수동 확인함(끊김·오정렬 없음).

## 3. 이전 검증

해당 없음 (`FEAT-` 신규 작업).

## 4. 시안 대조 재확인

해당 없음 — Figma 시안 없음(2026-11-09 확인, `design-source-policy §7`). 동작만 구현.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                   | 상태      |
| ------------------------------- | ----------------------------------------------------------- | --------- |
| `docs/implementation-status.md` | LG-01 리그 화면에 "내 순위 센터링 + 양방향 무한스크롤" 반영 | ✅        |
| `docs/migration-status.md`      | MIG 아님                                                    | 해당 없음 |
| 그 외 `docs/`                   | 확정 AC는 spec.md에 보존. 신규 토큰·규칙 없음               | 해당 없음 |

## 6. 중간에 막혔던 지점 — 스킬에 반영할 것

- **스크롤 애니메이션 ↔ 옵저버 레이스**: 진입 센터링(비동기 스크롤) 중 상단 센티넬이 보이면
  prepend가 일어나 보정이 스크롤을 끊었다. "스크롤이 멈춘 뒤에 옵저버를 켠다"로 해결. 비동기
  애니메이션과 스크롤 트리거를 같이 쓰는 기능은 **애니메이션 완료 시점 분리**가 핵심.
- **티어 전환 후 상태 잔존**: 리스트를 재사용하면 ref·스크롤 위치가 남아 재센터링이 안 됐다.
  `key={selectedTierId}`로 remount해 해결. "리스트 종류를 바꾸는 UI는 key로 뷰 상태를 리셋".
- **재진입 버퍼링 레이스**: 재진입마다 버퍼 fetch를 돌리면 빠른 전환 중 센터 타이밍과 엇갈려
  위치가 어긋났다. 버퍼링을 첫 진입에만 하고 재진입은 캐시 위에서 즉시 센터로 해결.
- **커스텀 애니메이션 단순화**: duration 조절용 rAF tween(40줄)을 네이티브 `scrollIntoView`로
  교체해 가독성 확보(유지보수자 이해도 우선). duration 제어·플랫폼 일관성은 포기.
