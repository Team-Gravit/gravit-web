---
id: 'FIX-022'
validated: '2026-09-10'
mode: 'fix'
---

# FIX-022 검증 결과

> `ai-validate` 산출물. **생략 금지.**
> 구현·머지가 끝난 뒤(PR #212 · `f36c5de`) 폴더가 `in-progress/`에 남아 있어 사후에 작성했다.
> 검증은 머지 결과가 반영된 `develop`에서 실행했다.

## 1. 자동 검증

| #   | 검사            | 명령                                               | 결과                              |
| --- | --------------- | -------------------------------------------------- | --------------------------------- |
| 1   | 린트 + FSD 경계 | `pnpm lint`                                        | ✅ No problems found (web·native) |
| 2   | 타입            | `pnpm check-types`                                 | ✅ 2 tasks 통과                   |
| 3   | 테스트          | `pnpm test`                                        | ✅ 16 files / 85 tests            |
| 4   | 빌드            | `pnpm build`                                       | ✅ built in 14.60s                |
| 5   | 포맷            | `pnpm exec prettier --check apps/web/vercel.json`  | ✅                                |
| 6   | generated 경계  | `pages`/`widgets`가 생성 경로를 직접 참조하지 않음 | ✅ 해당 없음 (코드 변경 없음)     |

> `pnpm format:check` 전체는 `REF-003`으로 기록된 기존 실패가 있어 실행하지 않았다.
> 이번 변경 파일만 검사했다 (`git-workflow.md` §3).

## 2. 요구사항 ↔ 구현 대조

| #   | 요구사항 (spec.md의 AC)                          | 구현 위치              | 상태                     |
| --- | ------------------------------------------------ | ---------------------- | ------------------------ |
| 1   | AC-1 `/terms` 직접 진입 시 404 없이 렌더된다     | `apps/web/vercel.json` | ✅ 배포 환경 실측        |
| 2   | AC-2 소셜 로그인 콜백 경로에서 404가 나지 않는다 | 〃                     | ✅ 배포 환경 실측        |
| 3   | AC-3 `apps/legacy-web/vercel.json`과 동일하다    | `apps/web/vercel.json` | ✅ `diff` 결과 차이 없음 |

**검증 방법** — `spec.md`의 「확인 필요」가 밝힌 대로 `vite dev`는 자체 SPA fallback이 있어
로컬에서는 404가 재현되지 않는다. 그래서 **배포된 dev 환경에 직접 요청해** 확인했다.

```
2026-09-10 · https://dev.gravit.inuappcenter.kr
/                                  HTTP 200  text/html
/terms                             HTTP 200  text/html   ← AC-1
/privacy                           HTTP 200  text/html
/login/oauth2/code/naver?code=…    HTTP 200  text/html   ← AC-2
```

응답 본문이 SPA 진입점(`<div id="app">` + `/assets/index-*.js`)이다. 즉 rewrite가 살아 있고
**정적 파일이 없는 경로도 `index.html`로 내려온다.** 재현 절차의 404가 해소됐다.

> AC-2의 「로그인이 완료된다」 중 콜백 이후 화면 전개는 `MIG-005`·`MIG-024` 범위다.
> 이 작업이 책임지는 부분은 **콜백 경로가 서버에서 404를 내지 않는 것**이고, 그것을 실측했다.

## 3. 이전 검증

해당 없음 (`FIX-`).

> 다만 이 결함의 원인 자체가 **이전 누락**이었다. legacy → `apps/web` 이전이 소스만 옮기고
> 배포 설정(`vercel.json`)을 옮기지 않았다. 같은 종류의 누락을 §5에 기록한다.

## 4. 시안 대조 재확인

해당 없음 (배포 설정 변경이라 화면 변화가 없다).

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용                    | 상태      |
| ------------------------------- | ---------------------------- | --------- |
| `docs/implementation-status.md` | 화면 상태 변화 없음          | 해당 없음 |
| `docs/migration-status.md`      | 화면 단위 이전 항목이 아니다 | 해당 없음 |
| 그 외 `docs/`                   | 아래 후속 항목으로 분리      | ⬜        |

### 후속으로 분리한 것

작업 중 발견했으나 범위 밖이라 고치지 않았다 (`work-management.md` §7).

| 항목                                                                               | 처리                           |
| ---------------------------------------------------------------------------------- | ------------------------------ |
| 콜백 URL의 `state`가 문자열 `"null"`이다 — 인가 URL을 서버가 만들므로 서버 쪽 문제 | `work/to-do/` 신규 항목 후보   |
| `apps/legacy-web/vercel.json` 정리                                                 | legacy 폐기 시점에 함께 다룬다 |
| **이전 시 배포·환경 설정 누락**을 잡을 장치가 없다 — 이번 결함의 근본 원인         | `MIG-` 절차 보강 검토 대상     |
