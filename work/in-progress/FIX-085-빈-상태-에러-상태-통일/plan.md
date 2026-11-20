---
id: 'FIX-085'
planned: '2026-11-18'
mode: 'fix'
---

# FIX-085 구현 계획

> `ai-plan` 산출물. **사용자 승인 전에는 다음 단계(구현)로 넘어가지 않는다.**

## 0. 모드 판정

`mode: fix` — 실패가 빈 상태로 보이는 결함과, 공용 컴포넌트에서 벗어난 빈 상태를 고친다. 구조 이전이 아니다.

## 1. 영향 분석

| 구분 | 파일                                                                                                 |
| ---- | ---------------------------------------------------------------------------------------------------- |
| 수정 | `pages/notice/ui/notice-list.tsx` · `notice-page.tsx` · `notice-list.test.tsx`                       |
| 수정 | `pages/inquiry/ui/my-inquiries-list.tsx` · `inquiry-history-page.tsx` · `my-inquiries-list.test.tsx` |
| 수정 | `entities/notification/ui/notification-fallback.tsx`                                                 |
| 수정 | `pages/notifications/ui/notifications-page.tsx` · `widgets/notification/ui/notification-popover.tsx` |
| 수정 | `widgets/social/friend-feed/ui/social-friends-feed-section.tsx`                                      |
| 수정 | `pages/unit-detail/ui/unit-detail-page.tsx`                                                          |
| 수정 | `widgets/chapter-grid/ui/chapter-grid.tsx`(+test) · `widgets/unit-list/ui/unit-list.tsx`(+test)      |

신규 · 삭제 없음. orval 재생성 · 라우트 변경 없음.

## 2. 문구 (전 → 후)

| 화면      | 전                                                                         | 후                                                                                       |
| --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 공지      | 등록된 공지사항이 없어요                                                   | 등록된 공지사항이 없어요.                                                                |
| 문의      | 등록된 문의 내역이 없어요 / 궁금한 점이 있다면 문의하기를 통해 남겨주세요. | 등록된 문의 내역이 없어요.\n궁금한 점이 있다면 문의하기를 통해 남겨 주세요. + [문의하기] |
| 알림      | 알림이 없어요. / 궁금한 점이 있다면 문의하기를 통해 남겨주세요.            | 알림이 없어요.\n궁금한 점이 있다면 문의하기를 통해 남겨 주세요.                          |
| 친구 활동 | (그대로, 두 줄)                                                            | 아직 활동한 친구가 없어요.\n더 많은 사용자들과 친구가 되어 보세요!                       |
| 레슨 없음 | (그대로, 두 줄)                                                            | 아직 등록된 레슨이 없어요.\n곧 새로운 레슨이 추가될 예정이에요.                          |
| 챕터      | 챕터가 없습니다.                                                           | 아직 챕터가 없어요.                                                                      |
| 유닛      | 유닛이 없습니다.                                                           | 아직 유닛이 없어요.                                                                      |

실패 섹션 이름: 공지사항 · 문의 내역 · 알림 · 친구 활동.

## 3. 구현 체크리스트

- [ ] `[entities]` `NotificationFallback` 본문을 `CardStatus`로. 상단 날짜 줄은 유지
- [ ] `[widgets]` 알림 팝오버: `isError && !data`면 `CardRetryStatus`
- [ ] `[widgets]` 친구 활동: 빈 상태 `CardStatus`, 실패 `CardRetryStatus` (카드 셸 · 제목 유지)
- [ ] `[widgets]` 챕터 그리드 · 유닛 목록 문구 + 테스트 문구
- [ ] `[pages]` 공지: `NoticeList`에 `isError` · `onRetry` props. 흰 상자 안에 `CardStatus` / `CardRetryStatus`
- [ ] `[pages]` 문의: 같은 방식 + 빈 상태 `[문의하기]`는 `CardStatusButton asChild`
- [ ] `[pages]` 알림 페이지: 실패 시 `CardRetryStatus` (당겨서 새로고침 유지)
- [ ] `[pages]` 유닛 상세 레슨 없음 → `CardStatus`
- [ ] `[test]` 공지 · 문의 목록에 「실패하면 재시도가 보이고 빈 문구는 안 보인다」 추가. 기존 빈 문구 테스트는 마침표 반영

## 4. 리스크

| 리스크                          | 영향                                                                                                                    | 대응                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `role` 변화                     | 직접 그린 곳은 role이 없었는데 `CardStatus`가 `status`/`alert`를 붙인다                                                 | 기존 테스트 실행. 의도된 접근성 개선            |
| 알림 빈 상태 모양               | 제목(`text-text-1`) + 설명 두 단계 → 한 가지 회색 글자. `notifications-page.tsx` 주석상 이 UI는 사용자가 직접 만든 부분 | 사용자 결정(공통 규격)으로 진행. PR에 전후 명시 |
| 재조회 실패 시 목록 사라짐      | 당겨서 새로고침 실패가 목록을 지울 수 있다                                                                              | `isError && !data` 조건                         |
| 전체 테스트 onboarding 타임아웃 | 기존 불안정                                                                                                             | 관련 파일 단독 실행 + PR 검사                   |

## 5. 확인 방법

- 자동: 공지 · 문의 목록 재시도 테스트, 챕터 · 유닛 문구 테스트, 관련 파일 vitest · tsc · eslint
- 수동: MSW 또는 개발자 도구로 `/api/v1/notices` · 문의 · 알림 · 피드를 500으로 막고 재시도 → 복구 확인. 빈 응답에서 문구 확인
