---
id: 'FEAT-047'
validated: '2026-10-07'
mode: 'feature'
---

# FEAT-047 검증 결과

> `ai-validate` 산출물.

## 1. 자동 검증

| #   | 검사            | 명령                                        | 결과                    |
| --- | --------------- | ------------------------------------------- | ----------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                 | ✅ No problems found    |
| 2   | 타입            | `pnpm check-types`                          | ✅ 통과                 |
| 3   | 테스트          | `pnpm test`                                 | ✅ 456 통과             |
| 4   | 빌드            | `pnpm build`                                | ✅ 통과                 |
| 5   | 포맷            | `pnpm exec prettier --check <변경 파일...>` | ✅ All matched files OK |
| 6   | generated 경계  | `pages`/`widgets` 생성 경로 직접 참조 없음  | ✅ (없음)               |

신규 테스트(알림): `action`(8) · `group-by-date`(3) · `use-session-follow-state`(이동, 4) ·
`notification-popover`(3) · `notifications-page`(6) · `use-congratulate-from-notification`(1).

## 2. 요구사항 ↔ 구현 대조

| #          | 요구사항 (AC)                                | 구현 위치 / 테스트                                                                           | 상태 |
| ---------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- | ---- |
| 공통-1     | actionType → 버튼 매핑 (SoT)                 | `entities/notification/model/action.ts` / `action.test.ts`(8)                                | ✅   |
| 공통-2     | 데스크톱 벨→팝오버, 외부클릭/Esc 닫힘        | `widgets/notification/ui/notification-popover.tsx` / `notification-popover.test.tsx`(AC-4·5) | ✅   |
| 공통-3     | 모바일 `/notifications` 날짜그룹+카드        | `pages/notifications/ui/notifications-page.tsx` / `notifications-page.test.tsx`               | ✅   |
| 공통-4     | 빈 목록 크래시 없이 0개                      | `notification-popover.test.tsx`(AC-6)                                                         | ✅   |
| Issue1-1~3 | `getActionDescriptor` 매핑                   | `action.test.ts`                                                                             | ✅   |
| Issue1-4~6 | 팝오버 렌더·닫기·빈 목록                     | `notification-popover.test.tsx`                                                              | ✅   |
| Issue2-1~2 | `groupByDate` 날짜 그룹화                    | `entities/notification/lib/group-by-date.test.ts`                                            | ✅   |
| Issue2-3   | 모바일 페이지 렌더                           | `notifications-page.test.tsx`(Issue2 AC-3)                                                    | ✅   |
| Issue2-4   | ProfileCard 벨 → `/notifications`            | `pages/my/ui/profile-card.test.tsx`                                                           | ✅   |
| Issue3-1~3 | FOLLOW 맞팔로우↔취소 토글, refetch 없음      | `notifications-page.test.tsx`(FOLLOW 토글 describe)                                           | ✅   |
| Issue4-1,3 | 축하하기↔완료 토글                           | `notifications-page.test.tsx`(축하 describe)                                                 | ✅   |
| Issue4-2   | 축하 시 인박스+소셜피드 캐시 동기화          | `features/notification-congratulate/api/use-congratulate-from-notification.test.tsx`         | ✅   |

## 3. 이전 검증 — 해당 없음 (FEAT, legacy 알림 화면 없음)

## 4. 시안 대조

구현 중 노드별 `get_design_context` 4단계로 1:1 대조 완료. 핵심 결과:

| 표면            | 대조 노드                 | 결과                                                                            |
| --------------- | ------------------------- | ------------------------------------------------------------------------------- |
| 데스크톱 팝오버 | 69837(알림창)·69839~69873 | 토큰 전부 일치. 스크롤바도 ScrollArea로 시안(7px·rounded·bg-4) 일치             |
| 모바일 페이지   | 54835·54842·54846         | 일치. **1건 ⚠**: 모바일 서브텍스트 색 시안 #555 vs 토큰 #6d6d6d(함정5, 정식 토큰) |

**확인 필요(미해소, 실데이터 대기)**:

- 모바일 FOLLOW 서브텍스트 출처: 현재 headline=actor.nickname / subText=message. message가 닉네임 포함 시 중복 → 백엔드 실데이터로 확인
- CONGRATULATE 수신 알림 아바타: API에 actor 없어 미표시(actor 있을 때만)
- 리그 승급 알림 실제 actionType: 미확정. actionType SoT 대로 처리

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                       | 상태 |
| ------------------------------- | -------------------------------------------------------------- | ---- |
| `docs/implementation-status.md` | 알림 화면(NOTI) 추가 — 2026-09-01 인벤토리 이후 신규라 별도 섹션 | ✅   |
| `docs/migration-status.md`      | 해당 없음 (FEAT)                                               | —    |
| `docs/design-system/`           | 토큰 신규 없음(기존 토큰만 사용)                                | —    |

## 설계 조정 기록 (ADR 대비)

- **ADR-1**: Radix Popover → **직접 구현**(의존성 0). 벨 고정 앵커라 Radix 이점 없음. 외부클릭·Esc·포커스복귀만 구현(완전 focus-trap은 범위 제외).
- **ADR-3(중요 변경)**: FOLLOW 토글을 "세션 로컬 set" → **인박스 캐시 직접 갱신(setQueryData)**으로 변경.
  - 사유: 알림 FOLLOW는 초기 상태 혼재(NONE=이미 팔로우/FOLLOW_BACK=미팔로우)라 set 모델에 안 맞고, 로컬 state만 쓰면 팝오버 재오픈·페이지 재진입 시 stale.
  - 결과: follow/unfollow mutation이 인박스 actionType을 갱신 → 버튼이 캐시 파생값으로 구동(로컬 state 제거). 축하(인박스+피드 동기화)와 동일 패턴으로 통일.
  - `use-session-follow-state`는 shared/lib로 승격된 채 recommend-friends(FIX-044)만 사용.

## 중간에 막혔던 지점 — 스킬에 반영할 것

1. **steiger `fsd/excessive-slicing`은 v0.7.0에서 임계값 하드코딩** — `['error',{maxSlices}]` 미지원. widgets 20 초과 시 규칙 off만 가능(사용자 승인 후 off + 후속 REF-048로 그룹화 분리).
2. **Radix ScrollArea 렌더 테스트는 `ResizeObserver` stub 필수**(jsdom 없음). 테스트 파일 beforeAll에서 stub.
3. **라우트 가드는 beforeLoad보다 `friends.tsx` 방식**(컴포넌트 `useIsWideViewport`+`useEffect` navigate+wide면 null) — live 리사이즈 반응 + 일관성.
4. **액션 토글의 stale** — 로컬 state만 쓰면 쿼리가 마운트 유지되는 팝오버 재오픈 시 stale. 액션 결과는 **쿼리 캐시에 반영**해야 재오픈·재진입에 일치.

## 범위 밖 관찰 (고치지 않음)

- widgets 그룹화 → **REF-048**(`work/to-do/`)로 분리. steiger 규칙 재활성화 포함.
