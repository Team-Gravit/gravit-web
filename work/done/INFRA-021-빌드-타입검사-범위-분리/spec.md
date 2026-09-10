---
id: 'INFRA-021'
title: '프로덕션 빌드의 타입 검사 범위를 앱 소스로 좁힌다'
type: 'infra'
screen: '-'
priority: 'high'
created: '2026-09-10'
revised: '2026-09-10'
---

# INFRA-021 — 프로덕션 빌드의 타입 검사 범위를 앱 소스로 좁힌다

## 배경 · 목표

Vercel에서 `@repo/web:build`가 실패한다. 로컬(Windows)에서는 `pnpm build`가 통과한다.

```
vitest.config.ts(19,5): error TS2769: No overload matches this call.
  Type 'Plugin<any>[]' is not assignable to type 'PluginOption'.
    Type 'node_modules/vite'.Plugin<any> is not assignable to type
         'node_modules/.pnpm/vite@5.4.17/node_modules/vite'.Plugin<any>.
```

**타입이 틀린 게 아니라 같은 타입을 서로 다른 타입으로 보고 있다.** `vite`의 타입 선언이
Vercel의 `node_modules`에 두 경로로 존재하고, TypeScript는 물리 경로가 다르면 이름이 같아도
다른 타입으로 취급한다.

## 재현

- Vercel 빌드 로그 (2026-09-10 16:41). `/vercel/path0/` 경로
- **로컬에서는 재현되지 않는다.** 리눅스 클린 설치에서만 나타난다

## 원인

세 가지가 겹친다.

| 요소                     | 상태                                                                       |
| ------------------------ | -------------------------------------------------------------------------- |
| `.npmrc`                 | `node-linker = hoisted` — 평평한 `node_modules`라 루트에도 `vite`가 생긴다 |
| `apps/web/package.json`  | `"build": "tsc && vite build"` — 프로덕션 빌드가 `tsc`를 먼저 돌린다       |
| `apps/web/tsconfig.json` | `include`에 `vitest.config.ts` · `vitest.setup.ts` · `.storybook`이 있다   |

결과적으로 **프로덕션 빌드가 테스트·Storybook 설정 파일까지 타입 검사한다.** 그 파일들이
`vitest/config`의 `defineConfig`와 `@vitejs/plugin-react` 같은 플러그인을 한자리에서 만나면서
두 `vite` 경로가 충돌한다.

### 버전 충돌이 아니다

`pnpm-lock.yaml`에 잡힌 vite는 **`5.4.17` 하나뿐**이다(`/vite@5.4.17:` 단일 항목).
설치 레이아웃 문제이지 의존성 충돌이 아니다.

### 이번 머지가 만든 회귀가 아니다

- `vitest.config.ts`는 머지 전 develop(`6c2459c`)에 이미 있었다
- 테스트 하네스 커밋(`5e37a22`)도 이미 develop의 조상이었다
- `#198`·`#202`·`#204` 머지는 `package.json` · `pnpm-lock.yaml`을 **하나도 바꾸지 않았다**
- 이번에 들어간 `vitest.config.ts` 변경은 `env` 블록 6줄 추가뿐인데 에러는 19번째 줄 `plugins`다

## 범위

- `apps/web/tsconfig.json` — `include`에서 **`vite`를 직접 import하는 설정 파일**을 뺀다
- `apps/web/tsconfig.tooling.json` 신규 — 그 파일들을 여기서 검사한다
- `apps/web/package.json` — `check-types`가 두 프로젝트를 모두 검사하게 한다

**"테스트 관련 파일"이 아니라 "vite를 import하는 파일"이 기준이다.** `vitest.setup.ts`는
이름이 테스트지만 vite를 쓰지 않고, `src`의 테스트 파일들이 이 파일의 jest-dom matcher
타입 증강에 의존하므로 앱 tsconfig에 남아야 한다.

### 이 변경이 자의적이지 않은 근거

`vite.config.ts`는 **이미 `include`에 없다.** 즉 "도구 설정 파일은 앱 빌드의 타입 검사 대상이
아니다"는 선례가 이 레포에 이미 있다. `vitest.config.ts`만 예외였던 것을 맞추는 것이다.

## Out of Scope

- **`node-linker = hoisted` 제거** — `apps/native`(Expo/Metro)가 평평한 `node_modules`를
  요구할 가능성이 크다. 건드리면 네이티브가 깨질 수 있어 별도 판단이 필요하다
- **Vite 5 → 8 업그레이드** — `INFRA-008`이 담당한다. **그쪽이 근본 해결이다.**
  이 작업은 빌드를 다시 굴러가게 하는 범위 조정이다
- **Vercel 설치 설정 변경** — pnpm 버전 고정 등은 원인이 확정된 뒤에 다룬다

## 확인 필요

1. **Vercel 빌드 로그 전체를 못 봤다.** 사용자가 붙여준 것은 `vitest.config.ts` 부분이다.
   `.storybook/main.ts`도 `vite`에서 `mergeConfig`를 import하므로 **같은 오류가 더 있을 수 있다.**
   그래서 `.storybook`도 함께 분리 대상에 넣었다
2. **Vercel이 어떤 pnpm으로 설치하는지 모른다.** 레포는 `pnpm@8.15.6` 고정인데 Vercel이
   9·10을 쓰면 lockfile 6.0을 재해석하면서 레이아웃이 달라진다. 원인이 여기일 수도 있다
3. **로컬에서 검증할 수 없다.** 고쳐졌는지는 Vercel 빌드로만 확인된다

## 확정 명세 · 검증 기준

- [ ] **AC-1**
      Given `apps/web/tsconfig.json`
      When `include`를 확인한다
      Then `vite`를 직접 import하는 파일(`vitest.config.ts` · `.storybook`)이 들어 있지 않다.
      `vitest.setup.ts`는 vite를 쓰지 않고 jest-dom matcher 타입 증강을 제공하므로 **남는다**

- [ ] **AC-2**
      Given `pnpm --filter @repo/web check-types`를 실행한다
      When 검사 대상을 확인한다
      Then 앱 소스와 도구 설정 파일이 **모두** 검사된다 (분리해도 검사 범위가 줄지 않는다)

- [ ] **AC-3**
      Given `pnpm build` · `pnpm test` · `pnpm lint`
      When 실행한다
      Then 전부 통과한다 (develop 기준 테스트 76건 유지)

- [ ] **AC-4** (Vercel에서만 확인 가능)
      Given 이 브랜치를 Vercel이 빌드한다
      When 빌드 로그를 확인한다
      Then `TS2769` 계열 오류 없이 성공한다

## Changelog

| 날짜       | 요약      | 사유                                                      | 연관 항목                       |
| ---------- | --------- | --------------------------------------------------------- | ------------------------------- |
| 2026-09-10 | 작업 등록 | develop 머지 후 Vercel 빌드 실패. 근본 해결은 `INFRA-008` | `INFRA-008` · PR #198·#202·#204 |
