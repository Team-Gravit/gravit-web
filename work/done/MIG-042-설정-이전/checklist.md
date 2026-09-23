---
id: 'MIG-042'
validated: '2026-09-23'
mode: 'migrate'
---

# MIG-042 검증 결과

> `ai-validate` 산출물.

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과 |
| --- | --------------- | -------------------------------------------------- | ---- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`                     | ✅   |
| 2   | 타입            | `pnpm --filter @repo/web check-types`              | ✅   |
| 3   | 테스트          | `pnpm --filter @repo/web test` (336 passed)        | ✅   |
| 4   | 빌드            | `pnpm --filter @repo/web build`                    | ✅   |
| 5   | 포맷            | `prettier --check <변경 파일 9종>`                 | ✅   |
| 6   | generated 경계  | `pages/settings`·설정 라우트가 생성 경로 직접 참조 없음 | ✅   |

## 2. 요구사항 ↔ 구현 대조

| #    | 요구사항 (spec.md의 AC) | 구현 위치 | 상태 |
| ---- | ----------------------- | --------- | ---- |
| AC-1 | 계정정보/기타 섹션 항목 렌더 | `settings-page.test.tsx` "계정정보 2항목과 기타 3항목…" | ✅ (공지사항 제외, 아래 3절) |
| AC-2 | 로그아웃 → 세션 비우고 `/` 이동 | `settings-page.tsx` `useLogout({onSuccess})`, `settings-page.test.tsx` "로그아웃을 누르면…" | ✅ |
| AC-3 | 개인정보 처리 방침 → `/privacy` | `settings-page.test.tsx` "개인정보 처리 방침은 /privacy 로…" | ✅ |
| AC-4 | 탈퇴하기 무동작 | `settings-page.tsx` `onClick={() => {}}`, `settings-page.test.tsx` "탈퇴하기를 눌러도…" | ✅ |

## 3. 이전 검증

| 항목 | 결과 |
| ---- | ---- |
| `plan.md` 이전 매핑 전량 반영 | ✅ SectionCard→Card 조합, useLogout 재사용, chevron-right 교체, 스텁 라우트 |
| 동작 동일성 — 기준선 유지 | ✅ 로그아웃·탈퇴 무동작·링크 목적지 매핑 유지. **단 공지사항은 의도적 보류** |
| 의도적으로 바꾼 것만 바뀌었나 | ✅ 아래 표 |
| 남은 legacy 참조 없나 | ✅ `rg "setting-box\|features/auth/logout\|ic-right-arrow" apps/web/src` → 없음 |

### 의도적으로 바꾼 것

| 항목 | 이유 |
| ---- | ---- |
| 화살표 `ic-right-arrow` → `chevron-right`(web Icon) | 시안 D1 · web 아이콘 시스템 |
| 항목 높이 py 기반 → `h-11 md:h-[74px] py-2` | 시안 D2 고정 높이 |
| 모바일 카드 패딩 `p-4` → `px-4 pt-4 pb-2` | 시안 D3 비대칭 |
| **공지사항 항목 주석 처리** | **공지사항 화면 미비. 사용자가 페이지 요청 대기로 보류(코드 내 TODO). AC-1을 계정정보 2항목으로 조정** |
| 마이페이지 설정 버튼 `<button>` → `<Link to="/settings">` | 진입점 배선(계획 확정 항목) |

## 4. 시안 대조 재확인

| #  | spec.md "고침" 항목 | 반영됨 |
| -- | ------------------- | ------ |
| D1 | 화살표 chevron-right 16/32 · #6d6d6d | ✅ (Figma 변수 `icon/default #6d6d6d` 재조회 일치) |
| D2 | 항목 높이 h-44/h-74·py-8 | ✅ `h-11 md:h-[74px] py-2` |
| D3 | 모바일 카드 pb-8 | ✅ `pt-4 pb-2` |
| D4 | 데스크톱 섹션 제목 weight | 미반영(전용 토큰 없음 · 판정 대기) |

## 5. 기준 문서 갱신

| 대상 | 갱신 내용 | 상태 |
| ---- | --------- | ---- |
| `docs/implementation-status.md` | 「매핑 미확인 구현」에 설정 목록(SETTING-01) 이전 추가 — 인벤토리 화면 ID 미확정이라 추측 연결 안 함 | ✅ |
| `docs/migration-status.md` | `/settings` 행 분리 · `/settings` 대체+검증 ✅ (MIG-042), `/settings/inquiry`·`/settings/notice` 스텁 | ✅ |
| 그 외 `docs/` | 해당 없음 (새 토큰·규칙 없음) | — |

## 중간에 막혔던 지점

- **`<li>` 안 wrapper의 `last:border-none` 오작동** — `<a>`/`<button>`이 각 `<li>`의 유일한
  자식이라 항상 last로 잡혀 구분선이 전부 사라졌다. border를 `<li>`로 올려 형제 `<li>` 기준으로
  판정하게 고쳤다. legacy는 `<ul>` 직속 자식이라 없던 문제 → **목록 항목을 `<li>`로 감쌀 때
  `last:` 대상 레벨을 주의**한다.
- **진입점을 `<Link>`로 바꾸면 그 컴포넌트의 기존 테스트가 라우터 없이 깨진다** —
  `profile-card.test.tsx`를 최소 라우터 트리로 감싸 복구했다. Link 배선 시 소비 컴포넌트
  테스트도 함께 확인.
- **아이콘 stroke** — 24 viewBox svg를 16px로 축소하면 stroke가 얇아 보인다. 사용자 판단으로
  `stroke-2` 적용 후 원복(현재 기본 1.5).
