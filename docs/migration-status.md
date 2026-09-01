# Legacy 폐기 현황 (`apps/legacy-web` → `apps/web`)

**legacy 기능이 새 앱으로 대체·검증됐는지, `apps/legacy-web`을 안전하게 폐기할 수 있는지 판단하는 대장이다.**

제품 화면의 플랫폼별 구현률은 [`implementation-status.md`](./implementation-status.md), 토큰 상태는
[`design-system/README.md`](./design-system/README.md)에서 관리한다. 이 문서에 둘을 중복 기록하지 않는다.

> 기준 문서이므로 상태가 바뀌면 덮어쓴다. `MIG-` 작업 완료 시 `ai-validate`가 갱신한다.

## 1. 완료 정의

코드나 라우트가 존재하는 것만으로 이전 완료로 보지 않는다.

| 단계      | 완료 조건                                                       |
| --------- | --------------------------------------------------------------- |
| 기준선    | legacy의 관찰 가능한 동작과 계약이 `work/{ID}/spec.md`에 기록됨 |
| 대체 구현 | 새 앱에 대응 코드와 라우트가 있고 legacy 없이 실행 가능         |
| 동작 검증 | 자동 테스트 또는 명시된 수동 검증으로 기준선과 동일성을 확인    |

상태: `✅` 완료 · `🚧` 진행 중 · `⬜` 미착수 · `—` 해당 없음.

### legacy 전체 폐기 조건

- [ ] 모든 이전 대상 라우트가 대체 구현되고 동작 검증됨
- [ ] 인증·API·Query 등 공용 런타임 기반이 대체됨
- [ ] 이전하지 않을 코드는 대체 또는 폐기 근거가 기록됨
- [ ] 운영 진입점이 `apps/web`으로 전환됨
- [ ] legacy만 참조하는 런타임 경로가 없음

legacy는 위 조건이 모두 충족될 때 한 번에 제거한다. 중간에 파일별로 삭제하지 않는다.
`apps/legacy-web`은 pnpm 워크스페이스 밖이라 부분 삭제로 깨져도 CI가 발견하지 못하기 때문이다.

## 2. 요약

| 영역                | 동작 검증 완료 | 전체 | 폐기 차단 요소                |
| ------------------- | -------------: | ---: | ----------------------------- |
| 사용자 라우트       |              2 |   35 | 인증 기반과 주요 화면 미이전  |
| 공용 기반           |              2 |   12 | 인증·Query·반응형 기반 미이전 |
| 이전 제외·폐기 대상 |              4 |    4 | 없음                          |

`apps/web`이 현재 제공하는 제품 라우트는 `/terms`, `/privacy`다. `/`는 스캐폴드 화면이므로
제품 구현 완료로 세지 않는다.

## 3. 사용자 라우트 대체 현황

### 공개 라우트

| Legacy URL                     | 새 경로        | 기준선 | 대체 구현 | 동작 검증 | 작업    | 비고                 |
| ------------------------------ | -------------- | :----: | :-------: | :-------: | ------- | -------------------- |
| `/terms`                       | `/terms`       |   ✅   |    ✅     |    ✅     | MIG-004 | Figma 시안 미확인    |
| `/privacy`                     | `/privacy`     |   ✅   |    ✅     |    ✅     | MIG-004 | Figma 시안 미확인    |
| `/`                            | 미정           |   ⬜   |    ⬜     |    ⬜     | —       | 현재 스캐폴드가 점유 |
| `/restore`                     | 미정           |   ⬜   |    ⬜     |    ⬜     | —       | 계정 복구            |
| `/user/me/delete/page`         | 미정           |   ⬜   |    ⬜     |    ⬜     | —       | 회원 탈퇴            |
| `/login/oauth2/code/$provider` | 동일 경로 예정 |   ✅   |    ⬜     |    ⬜     | MIG-005 | 인증 기반 라우트     |

### 인증 필요 라우트

아래 라우트는 모두 MIG-005 인증 기반이 선행돼야 한다.

| 영역        | Legacy URL                                                                                 | 기준선 | 대체 구현 | 동작 검증 | 작업 |
| ----------- | ------------------------------------------------------------------------------------------ | :----: | :-------: | :-------: | ---- |
| 메인        | `/main`, `/mains`                                                                          |   ⬜   |    ⬜     |    ⬜     | —    |
| 학습        | `/learning`                                                                                |   ⬜   |    ⬜     |    ⬜     | —    |
| 학습        | `/learning/$chapterId`                                                                     |   ⬜   |    ⬜     |    ⬜     | —    |
| 학습        | `/learning/$chapterId/$unitId`                                                             |   ⬜   |    ⬜     |    ⬜     | —    |
| 학습        | `/learning/$chapterId/$unitId/concept-note`                                                |   ⬜   |    ⬜     |    ⬜     | —    |
| 학습        | `/learning/$chapterId/$unitId/$lessonId`                                                   |   ⬜   |    ⬜     |    ⬜     | —    |
| 학습        | `/learning/$chapterId/$unitId/bookmarked-problems`                                         |   ⬜   |    ⬜     |    ⬜     | —    |
| 학습        | `/learning/$chapterId/$unitId/incorrect-problems`                                          |   ⬜   |    ⬜     |    ⬜     | —    |
| 리그        | `/league`                                                                                  |   ⬜   |    ⬜     |    ⬜     | —    |
| 마이페이지  | `/my`, `/my/summary`, `/my/learning`, `/my/league`, `/my/social`, `/my/edit`, `/my/follow` |   ⬜   |    ⬜     |    ⬜     | —    |
| 사용자·공지 | `/user`, `/user/edit`, `/user/addfriend`, `/user/privacy`                                  |   ⬜   |    ⬜     |    ⬜     | —    |
| 사용자·공지 | `/user/notice`, `/user/notice/$page`, `/user/notice/$page/$noticeId`                       |   ⬜   |    ⬜     |    ⬜     | —    |
| 설정·문의   | `/settings`, `/settings/inquiry`, `/settings/inquiry/new`                                  |   ⬜   |    ⬜     |    ⬜     | —    |
| 온보딩      | `/onboarding`, `/success`                                                                  |   ⬜   |    ⬜     |    ⬜     | —    |

한 행에 여러 URL이 묶인 경우 작업을 만들 때 사용자에게 관찰 가능한 단위로 행을 분리한다.

## 4. 공용 기반 대체 현황

파일명이 아니라 기능을 식별자로 삼는다. 경로가 바뀌어도 기능의 대체 여부를 추적하기 위해서다.

| 기능           | Legacy 근거                           | 새 소유 위치             | 기준선 | 대체 구현 | 동작 검증 | 작업    | 영향             |
| -------------- | ------------------------------------- | ------------------------ | :----: | :-------: | :-------: | ------- | ---------------- |
| Footer         | `widgets/Footer/Footer.tsx`           | `widgets/footer/`        |   ✅   |    ✅     |    ✅     | MIG-004 | 전체 공개 화면   |
| Gravit 로고    | 로고 SVG 2종                          | `shared/ui/logo/`        |   ✅   |    ✅     |    ✅     | MIG-004 | Header·Footer    |
| 인증 세션      | `shared/api/config.ts`                | 미정                     |   ✅   |    ⬜     |    ⬜     | MIG-005 | 인증 화면 전체   |
| OAuth callback | callback route                        | `app/routes/`            |   ✅   |    ⬜     |    ⬜     | MIG-005 | 로그인           |
| 반응형 판정    | `shared/model/use-responsive.ts`      | `shared/lib/` 검토       |   ⬜   |    ⬜     |    ⬜     | —       | 15개 사용처      |
| Toast          | `shared/lib/toast/`                   | `shared/ui`+`shared/lib` |   ⬜   |    ⬜     |    ⬜     | —       | 6개 사용처       |
| Query 초기화   | `shared/lib/query/`                   | `app/query/`             |   ⬜   |    ⬜     |    ⬜     | —       | API 화면 전체    |
| 무한 스크롤    | `shared/model/use-infinite-scroll.ts` | `shared/lib/`            |   ⬜   |    ⬜     |    ⬜     | —       | 3개 사용처       |
| Planet 유틸    | `shared/lib/planet/`                  | 소비자 slice             |   ⬜   |    ⬜     |    ⬜     | —       | 2개 사용처       |
| 공용 Button    | `features/button/`                    | `shared/ui/button/`      |   ⬜   |    ✅     |    ⬜     | —       | 사용처 전환 필요 |
| 메인 위젯      | `widgets/main`, `widgets/main-page`   | `widgets/main/`          |   ⬜   |    ⬜     |    ⬜     | —       | 병합 판정 필요   |
| Sidebar        | `entities/sidebar`, `widgets/sidebar` | 미정                     |   ⬜   |    ⬜     |    ⬜     | —       | 소유권 판정 필요 |

## 5. 이전 제외·폐기 대상

| 대상                                                 | 판정      | 대체 수단 또는 근거                             | 작업    |
| ---------------------------------------------------- | --------- | ----------------------------------------------- | ------- |
| `shared/api/@generated/`                             | 이전 제외 | Orval `generate:api`가 대체                     | MIG-005 |
| `features/auth/use-refresh-token.tsx`                | 폐기      | 전체가 주석 처리됐고 실제 갱신 로직은 다른 파일 | MIG-005 |
| `shared/lib/test/`                                   | 폐기      | 개발용 잔재                                     | —       |
| `pages/_authenticated/_fixed-header-layout/test.tsx` | 폐기      | 운영 대상이 아닌 테스트 화면                    | —       |

## 6. 폐기 차단 항목

상세 판단은 해당 `work/{ID}/spec.md`에 두고 여기에는 폐기를 막는 항목만 남긴다.

| 항목                                  | 영향                       | 작업           |
| ------------------------------------- | -------------------------- | -------------- |
| `/main`과 `/mains`의 제품상 관계 미정 | 메인 라우트 목표 결정 불가 | 신규 작업 필요 |
| 인증 갱신·게이트 계약 미확정          | 인증 화면 전체             | MIG-005        |

## 7. 갱신 규칙

- 기준선만 작성했으면 `기준선`만 완료 처리한다
- 코드가 있어도 동작을 검증하기 전에는 `동작 검증`을 완료 처리하지 않는다
- `MIG-` 완료 시 라우트와 공용 기반 중 해당 행을 모두 갱신한다
- 토큰 부채와 Figma 구현 상태는 이 문서에 기록하지 않는다
- 사용자 판정이 필요한 항목을 AI가 임의로 완료 처리하지 않는다

## 갱신 이력

| 날짜       | 내용                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| 2026-09-01 | 역할 재정의. 제품 구현·토큰 상태를 분리하고 legacy 폐기 조건 중심으로 개편 |
| 2026-08-31 | 최초 작성. MIG-004 완료 반영                                               |
