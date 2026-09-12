---
id: 'MIG-025'
---

# MIG-025 마이페이지 이전 — 실행 이슈 분해

> 작업 폴더는 하나(MIG-025), 실행 이슈 5개로 나눈다. 각 실행 이슈 = GitHub Issue 1개.
> `plan.md`·`checklist.md`는 개별 이슈가 아니라 작업 전체의 순서·완료를 관리한다.
> GitHub 이슈는 **각 단계 착수 시점에** 생성한다.

## 5단계 매핑

| Phase | 실행 이슈                        | GitHub Issue | 상태     |
| ----- | -------------------------------- | ------------ | -------- |
| 1     | 레이아웃 구조 + 공통 컴포넌트    | [#225](https://github.com/Team-Gravit/gravit-web/issues/225) | 진행 예정 |
| 2     | 요약 탭                          | 미등록       | 대기     |
| 3     | 학습 탭 (+ Fallback)             | 미등록       | 대기     |
| 4     | 리그 탭 (+ Fallback)             | 미등록       | 대기     |
| 5     | 소셜 탭 (+ 팔로우/팔로잉)        | 미등록       | 대기     |

각 Phase는 수직 슬라이스다 — 완료 시 해당 탭 화면을 실제로 보여줄 수 있다.

---

## Issue 1 (Phase 1): [Migrate] 마이페이지 레이아웃 구조·공통 컴포넌트 이전

GitHub Issue: [#225](https://github.com/Team-Gravit/gravit-web/issues/225)

### 설명

요약·학습·리그·소셜 4개 탭이 공유하는 프로필 카드 + 섹션 탭 + 레이아웃을 먼저 이전한다.
이 이슈 완료 시 `/my/*` 진입에서 프로필 카드와 탭이 보이고 탭 이동이 동작한다.

### 구현 범위

- `app/routes/_authenticated/_app-shell/my/` — `route.tsx`(레이아웃), `index.tsx`(리다이렉트), `summary/learning/league/social.tsx`(스텁)
- `pages/my/ui/` — 레이아웃 컴포넌트, 프로필 카드, 섹션 탭
- `shared/ui/tab/` — 탭 프리미티브 이전
- `entities/user/api/` — `useMyPageBanner` 어댑터

### 완료 조건 (Acceptance Criteria)

> design-diff + GATE 이후 확정 명세로 구체화한다.

☐ **AC-1** (범위: 통합) `/my` 진입 시 `/my/summary`로 이동한다
☐ **AC-2** (범위: 통합) 섹션 탭 4개(요약/학습/리그/소셜)가 렌더되고, 현재 경로에 해당하는 탭이 활성 표시된다
☐ **AC-3** (범위: 통합) 배너 데이터가 있으면 닉네임·`@handle`·`LV.{level}`·리그·연속학습 라벨이 카드에 표시된다

### 의존성

없음 (Phase 1이 나머지 Phase의 선행)

---

## Issue 2~5

각 탭 착수 시 이 문서에 상세를 채우고 GitHub Issue를 연결한다.

- **Issue 2 (요약)**: `pages/my` summary 탭. Issue 1 완료 후.
  - ⏸ **Suspense 도입 재검토**: my-page는 섹션마다 쿼리를 각각 부른다(배너/요약/…). Phase 1은 수동 분기+스켈레톤(league 패턴과 일관). Phase 2에서 여러 쿼리가 모이면 Suspense 전면 채택(orval suspense 훅 설정 + Suspense/ErrorBoundary 또는 라우트 loader + `api/state-convention` 문서화)을 **INFRA 항목으로** 검토한다. 결정 시 이 카드 스켈레톤도 그 패턴으로 재작성.
- **Issue 3 (학습)**: 학습 탭 + Fallback. Issue 1 완료 후.
- **Issue 4 (리그)**: 리그 탭 + Fallback. Issue 1 완료 후. (apps/web `entities/league` 재사용 검토)
- **Issue 5 (소셜)**: 소셜 탭 + 팔로우/팔로잉(모달/페이지). Issue 1 완료 후. 편집·팔로우 feature 신설 검토.

---

## 시퀀스 검토

- [x] Phase 1이 나머지의 선행 (레이아웃·탭 없이는 탭 콘텐츠를 붙일 곳이 없음)
- [x] Issue 2~5는 서로 독립 (각 탭 콘텐츠) — Phase 1 이후 병렬 가능
- [x] Out of Scope(편집 모달·설정 페이지)는 어떤 Phase에도 들어가지 않음 — 별도 항목
