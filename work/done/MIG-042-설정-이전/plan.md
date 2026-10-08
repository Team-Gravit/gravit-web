---
id: 'MIG-042'
planned: '2026-09-23'
mode: 'migrate'
---

# MIG-042 — 환경설정 화면 이전 · 구현 계획

## 1. 작업 종류

`MIG-` — legacy-web의 `/settings`를 apps/web으로 옮긴다. 동작 변경 없음(순수 이전 + 시안 소폭 정합).

## 2. 착수 게이트 (refactor-checklist §1)

| 질문 | 답 · 근거 |
| ---- | --------- |
| 목표/비목표 명확 | ✅ 설정 화면을 web으로 이전(동작 보존). 신기능·탈퇴 플로우·공지/문의 본체는 비목표(spec Out of Scope) |
| 반복 비용·확장 차단 | ✅ legacy 이전이 진행 중이며, 설정까지 옮겨야 web 단독 운영/legacy 폐기 조건에 근접 |
| 기준선 | ✅ `spec.md` 현행 동작 기준선 7항목 |
| 검증 방법 | ✅ `/settings` 라우트 진입 확인 + 단위 테스트 + Figma 재대조 + lint/type/test/build |
| 범위 독립 완료 | ✅ 한 화면. 없는 링크는 스텁으로 격리해 단독 완결 |
| 위험 격리 | ✅ 라우트 트리·헤더 레이아웃·스텁 링크를 리스크로 식별(§5) |

**자동 보류 신호(§2): 해당 없음.** 동작 변경과 구조 변경이 섞이지 않고, 자동 생성물 직접 수정도 없다.

## 3. 영향 분석 · 이전 매핑

신규 화면이라 기존 참조는 없다(`rg settings`는 아이콘 맵과 마이페이지 설정 버튼뿐).

### 이전 매핑표

| 현재 위치 (legacy) | 목표 위치 (web) | 변경 종류 | 비고 |
| --- | --- | --- | --- |
| `widgets/setting-box/setting-box.tsx` (SettingBox) | `pages/settings/ui/settings-page.tsx` | 이전+수정 | 재사용/조합 최소 → widget 아닌 page ui에 배치 |
| 〃 내부 `SettingBoxItem` | 동 파일 내부 비-export 헬퍼 | 이전 | link/button 판별 유니온 유지 |
| `pages/_authenticated/settings/{index,route}.tsx` | `app/routes/_authenticated/settings/{route,index}.tsx` | 재작성 | web 라우트 규칙 + 셸 레이아웃 |
| `features/auth/logout` | `features/auth-logout` (기존) | 재사용 | `useLogout({ onSuccess })` |
| `shared/ui/card/section-card.tsx` | `Card` + `CardHeader`/`CardTitle` (기존) | 재사용 조합 | CardTitle 색 override |
| `RightArrowIcon` (svg?react) | `<Icon name="chevron-right" />` | 교체 | D1 |
| `SettingBox.tsx` (구, 미사용) | — | 제외 | 이전 대상 아님 |

### 링크 경로 매핑

| 항목 | web 목적지 | 상태 |
| --- | --- | --- |
| 내 정보 | `/my` | 기존 |
| 개인정보 처리 방침 | `/privacy` | 기존 |
| 공지사항 | `/settings/notice` | **스텁 신설** |
| 문의하기 | `/settings/inquiry` | **스텁 신설** |
| 로그아웃 | `useLogout` → navigate `/` | 기존 훅 |
| 탈퇴하기 | 없음(빈 동작) | 현행 유지 |

## 4. 구현 계획 (레이어 순)

- [ ] `[pages]` `pages/settings/ui/settings-page.tsx` 작성 — legacy `setting-box.tsx`를 가져와 수정:
      Card+CardHeader/CardTitle 조합, 내부 `SettingsItem`(link/button 유니온), `<Icon name="chevron-right" />`,
      모바일 `PageTitleBar`(title="환경설정", backTo `/my`, md:hidden), `useLogout`, 시안 정합(D2 항목 높이 h-44/h-74·py-8, D3 모바일 카드 pb-8)
- [ ] `[pages]` `pages/settings/index.ts` 배럴 (`export { SettingsPage }`)
- [ ] `[pages]` `pages/settings/ui/settings-page.test.tsx` — AC-1(6항목)·AC-2(로그아웃)·AC-4(탈퇴 무동작)
- [ ] `[app]` `app/routes/_authenticated/settings/route.tsx` — 설정 셸 레이아웃: 데스크톱 `Header variant="solid"`(hidden md:block) + solid offset, 바텀탭 없음, 배경 `bg-bg-2`
- [ ] `[app]` `app/routes/_authenticated/settings/index.tsx` — `component: SettingsPage`
- [ ] `[app]` 스텁 라우트 `settings/notice.tsx`, `settings/inquiry.tsx` — `component: () => null` (friends.search 패턴)
- [ ] `[app]` **라우트 트리 재생성** (dev/build로 `routeTree.gen.ts` 갱신) 후 `check-types`
- [ ] `(선택)` `[pages]` `my/profile-card.tsx` 설정 버튼(`aria-label="설정"`)을 `/settings` Link로 연결 — **게이트에서 판정**

## 5. 리스크 · 동일성 확인

| 리스크 | 영향 | 대응 |
| ------ | ---- | ---- |
| 설정 셸 레이아웃 신규(header offset·배경 seam) | 데스크톱 헤더 겹침/회색 seam | `_app-shell/route.tsx` 패턴 참고(bg-2 레이어·solid pt) |
| 스텁 경로 타입 | 트리 재생성 전 Link 타입 에러 | 스텁 라우트 먼저 만들고 재생성 후 check-types |
| 진입점 미배선 | /settings 도달 불가 | (선택) profile-card 연결 판정 |
| D4 섹션 제목 weight | 미세 시각차 | 전용 토큰 없음 → 하드코딩 금지, 판정 대기 |

### 동일성 확인 방법

| 방법 | 내용 |
| --- | --- |
| 라우트 진입 | `/settings` 열어 계정정보 3 + 기타 3 = 6항목, 탈퇴 흐린 색 확인 |
| 수동 스모크 | 로그아웃 클릭 → `/`로 이동, 세션 비움 |
| 자동 테스트 | `settings-page.test.tsx`로 AC-1·2·4 |
| 시안 재대조 | 구현 후 `get_design_context` 재호출해 padding/gap/font/radius/color 1:1 표 대조(사용자 지시 4단계) |

## 6. 검증

`pnpm --filter @repo/web lint` → `check-types` → `test` → `build`,
변경 파일 `prettier --check`.
