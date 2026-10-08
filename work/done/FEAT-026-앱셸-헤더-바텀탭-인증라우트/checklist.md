---
id: 'FEAT-026'
validated: '2026-09-12'
mode: 'feature'
---

# FEAT-026 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                             | 결과 |
| --- | --------------- | ------------------------------------------------ | ---- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                      | ✅   |
| 2   | 타입            | `pnpm check-types`                               | ✅   |
| 3   | 테스트          | `pnpm test` (27 파일 · 147 통과)                 | ✅   |
| 4   | 빌드            | `pnpm build`                                     | ✅   |
| 5   | 포맷            | `pnpm exec prettier --check <이번 변경 파일...>` | ✅   |
| 6   | generated 경계  | FEAT-026 신설 위젯/페이지가 생성 경로 직접 참조 X | ✅   |

- 6번: `widgets/header`·`widgets/bottom-tab-bar`·`pages/learning`·`pages/my` 모두 `shared/api/generated` 직접 참조 없음. `rg`가 잡은 `widgets/league-season-modal` 3건은 MIG-023(기존) 산출물이라 범위 밖.
- 포맷: `header.tsx`의 import 정렬 위반(별칭 그룹이 상대경로 아래)만 발견 → 정렬 수정 + `entities/user` 중복 import 병합. 재확인 통과.

## 2. 요구사항 ↔ 구현 대조

spec에 번호형 AC는 없고 **범위 · 확정 설계 결정**이 기준이다.

| #   | 요구사항 (spec 범위/결정)                                     | 구현 위치                                                                 | 상태 |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------- | ---- |
| 1   | 인증 가드: 토큰 없으면 `/`로 redirect                        | `_authenticated/route.tsx` `beforeLoad(!getSessionToken()→redirect '/')` | ✅   |
| 2   | 셸: 데스크톱 헤더 `hidden md:block` + 모바일 바텀탭 `md:hidden` | `_authenticated/_app-shell/route.tsx` `AppShell`                          | ✅   |
| 3   | 헤더 variant = `staticData.headerVariant`, `useMatches` 상속  | `_app-shell/route.tsx` + `router.ts` `StaticDataRouteOption` 확장         | ✅   |
| 4   | league=overlay · main=solid · learning/my=solid staticData   | 각 `_app-shell/*.tsx` `staticData`                                         | ✅   |
| 5   | 헤더 유저 메뉴(프로필·로그아웃) — 기존 `entities/user` 재사용  | `widgets/header/ui/header.tsx` `HeaderUserMenu`(`useUser`·`ProfileAvatar`) | ✅   |
| 6   | 모바일 바텀탭 4탭 outline/fill 교체 + active                  | `widgets/bottom-tab-bar` + `ui/assets/*.svg` 8종                          | ✅   |
| 7   | 인증 페이지 새 구조 이동(URL 불변) + learning/my stub         | `_authenticated/_app-shell/*`, `onboarding/*`(셸 밖)                      | ✅   |
| 8   | 셸 offset 토큰 단일 소스 (`--bottom-tab-height` 60px)         | `tokens.css` 68→60, `_app-shell/route.tsx` 패딩                           | ✅   |

## 3. 이전 검증 (라우트 이동분 — 동작 보존)

| 항목                                          | 결과 |
| --------------------------------------------- | ---- |
| `plan.md` 2-1 이전 매핑 전량 반영             | ✅ `_protected.*` → `_authenticated/*` 5건 모두 이동 |
| 동작 동일성 — URL 불변(`/league`·`/main`·`/onboarding`) | ✅ pathless 레이아웃 리네임, `routeTree.gen.ts` 재생성 확인 |
| 남은 legacy(`_protected`) 참조 없음           | ✅ `rg "_protected" apps/web/src` → 0건 |

### 의도적으로 바꾼 것

| 항목                                              | 이유                                                        |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `league-page` `h-svh` → `h-full`                  | 셸 콘텐츠 영역이 `h-svh` 스크롤 컨테이너를 소유하므로 자식은 채우기만 |
| `league-arena`/`ranking-list` 패딩 조정           | 셸 통합 후 헤더 offset과 겹치지 않게 상단 패딩 재배치        |
| `--bottom-tab-height` 68→60px                     | Figma 기준값(60px)으로 확정                                 |

## 4. 시안 대조 재확인

헤더/바텀탭 시안 대조를 이 작업에 통합해 수행했다(spec 「시안 대조 결과」 참조). 고침 6건 반영.

| #   | 고침 항목                     | 구현 위치                                                              |
| --- | ----------------------------- | --------------------------------------------------------------------- |
| 2   | nav 간격 `gap-20`             | `widgets/header/ui/header.tsx`                                        |
| 3   | 활성 underline(solid 포함)    | `header.tsx` `activeProps`                                            |
| 4·5 | solid `bg-bg-1 backdrop-blur-[66px]`(그림자 제거) | `header.tsx` `VARIANT_CLASS.solid`               |
| 6   | 로그아웃 `font-medium`        | `header.tsx`                                                          |
| 8   | 비활성 라벨 `text-icon`       | `widgets/bottom-tab-bar/ui/bottom-tab-bar.tsx`                        |
| 9   | 보더 제거 + `bg-white shadow-[0_4px_3.5px_rgba(0,0,0,0.1)]` | `bottom-tab-bar.tsx`                        |

검증: lint ✅ · check-types ✅ · build ✅ · prettier ✅. #1·#7은 유지(코드 변경 없음).

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                                                                  | 상태 |
| ------------------------------- | -------------------------------------------------------------------------- | ---- |
| `docs/implementation-status.md` | 해당 없음 — 앱 셸은 Figma 화면 ID가 아닌 네비 크롬. 시안 대조는 후속        | ✅   |
| `docs/migration-status.md`      | 해당 없음 — FEAT(신규). 라우트 이동은 web 내부 구조 전환(legacy 폐기 아님) | ✅   |
| `.claude/rules/fsd-pages.md`    | 앱 셸 · 인증 라우트 3층 배치 규칙 추가(spec의 팀 공유 규칙 승격)            | ✅   |

## 중간에 막혔던 지점 — 스킬에 반영할 것

- 작업 디렉터리가 첫 `cd work/...` 명령으로 이동해 이후 상대경로 `work/in-progress`가 깨졌다. Bash working directory가 세션 내 유지됨을 유의 → **절대경로 사용**.
- 특이 실패 없이 전 항목 그린. `routeTree.gen.ts`는 이미 재생성돼 있어 순서 문제 미발생.
