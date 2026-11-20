---
id: 'FIX-085'
title: '빈 상태 · 에러 상태 공용 컴포넌트 통일'
type: 'fix'
screen: '-'
priority: 'medium'
created: '2026-11-18'
revised: '2026-11-18'
---

# FIX-085 — 빈 상태 · 에러 상태 공용 컴포넌트 통일

GitHub Issue: #437

## 배경 · 목표

공지 · 문의 · 알림 · 친구 활동은 요청이 실패해도 "없어요"를 보여 주고 다시 시도할 방법이 없다.
빈 상태도 화면마다 직접 그려 글자 크기 · 색 · 배치가 다르다.
빈 상태는 `CardStatus`, 실패는 `CardRetryStatus`로 통일하고, 문구를 해요체 · 마침표로 맞춘다.

## 범위

| 화면                | 파일                                                                  | 빈 상태 | 에러 상태 추가 |
| ------------------- | --------------------------------------------------------------------- | :-----: | :------------: |
| 공지사항            | `pages/notice/ui/notice-list.tsx` · `notice-page.tsx`                 |   ✅    |       ✅       |
| 문의 내역           | `pages/inquiry/ui/my-inquiries-list.tsx` · `inquiry-history-page.tsx` |   ✅    |       ✅       |
| 알림 페이지         | `pages/notifications/ui/notifications-page.tsx`                       |   ✅    |       ✅       |
| 알림 팝오버         | `widgets/notification/ui/notification-popover.tsx`                    |   ✅    |       ✅       |
| 친구 활동           | `widgets/social/friend-feed/ui/social-friends-feed-section.tsx`       |   ✅    |       ✅       |
| 유닛 상세 레슨 없음 | `pages/unit-detail/ui/unit-detail-page.tsx`                           |   ✅    | — (이미 있음)  |
| 챕터 · 유닛 목록    | `widgets/chapter-grid` · `widgets/unit-list`                          | 문구만  |       —        |

## Out of Scope

- Figma 대조 (사용자 결정 2026-11-18: 공통 컴포넌트 규격에 맞춘다)
- /league 로딩 · 에러 화면 (리그 이슈에서 다룬다)
- `CardStatus` · `CardStatusButton` 자체의 모양 변경
- 빈 상태를 감싸는 상자(흰 배경 · 높이)와 화면 배치

## 확정 명세

- 빈 상태 글자: `CardStatus` 한 가지 (`text-label1 md:text-heading1 text-text-4`). 두 줄이면 `\n` + `whitespace-pre-line`
- 빈 상태 행동: `CardStatusButton`
- 실패: `CardRetryStatus` (「{섹션}을/를 불러오지 못했어요.」 + 다시 시도 → `refetch`)
- 문구: 해요체 · 마침표
- 이미 받은 데이터가 있는 상태에서 재조회가 실패하면 기존 목록을 그대로 둔다 (`isError && !data`일 때만 에러 상태)
