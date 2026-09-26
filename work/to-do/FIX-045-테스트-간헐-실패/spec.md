---
id: 'FIX-045'
title: '전체 실행에서만 깨지는 테스트 2개'
type: 'fix'
screen: 'MAIN-01 · O.3'
priority: 'medium'
created: '2026-09-25'
revised: '2026-09-25'
---

# FIX-045 — 전체 실행에서만 깨지는 테스트 2개

GitHub Issue: [#258](https://github.com/Team-Gravit/gravit-web/issues/258)

## 배경 · 목표

`pnpm test` 전체 실행에서 아래 두 테스트가 **간헐적으로** 실패한다.

```
FAIL  src/pages/main/ui/main-page.test.tsx
      MainPage — 넓은 화면 > 진입 시 main-pages 6종이 각 1회만 나간다 — learning · profile 중복 없음 (AC-1)

FAIL  src/pages/onboarding/ui/onboarding-page.test.tsx
      OnboardingPage > 화면 전환 후에도 입력값과 선택한 색을 제출하고 요청 중 상태를 유지한다
```

**목표는 두 테스트가 전체 실행에서도 일관되게 통과하게 만드는 것이다.** 테스트를 지우거나
`skip` 하지 않는다 (`test-policy.md` §6).

## 관찰한 사실

| 조건                                 | 결과                     |
| ------------------------------------ | ------------------------ |
| 두 파일만 단독 실행                  | ✅ 11 tests 통과         |
| 전체 실행 (`turbo run test --force`) | ❌ 2 failed / 385 passed |
| **같은 트리에서 전체 재실행**        | ✅ 387 passed            |

- 같은 커밋·같은 워킹트리에서 결과가 갈렸다. **간헐적 실패다.**
- **재발률 2/3.** 2026-09-25 FEAT-044 작업 중 세 번의 전체 실행에서 두 번 같은 두 테스트가
  깨졌다. 드물게 나는 것이 아니라 상당히 자주 난다.
- 두 테스트 모두 느리다 — `main-page` 1362ms · `onboarding-page` 1774ms.
  전체 실행에서는 다른 파일과 CPU를 나눠 쓰므로 더 느려진다.
- 확인 시점의 기준 커밋은 `f3dacc7`(PR #255 머지)이다. 이 커밋에서 새로 생긴 실패인지,
  그 전부터 있었는지는 **아직 확인하지 않았다.**

## 왜 지금 고쳐야 하는가

이 저장소에는 **PR 자동 검사가 없다** (`git-workflow.md` §3). lint·type·test·build를 사람이
돌려 결과를 판단하는 구조다. 그 판단의 근거가 흔들리면

- 실패를 봐도 「원래 흔들리는 거겠지」로 넘기게 된다
- 진짜 회귀가 섞여 들어와도 구분할 수 없다

실패 자체보다 **검증을 못 믿게 되는 것**이 비용이다.

## 확인 필요

1. **원인이 타임아웃인가 다른 것인가.** 이번 실행에서 단언 메시지를 남기지 않았다.
   재현될 때 실패 상세(expected/received)를 받아야 방향이 갈린다.
2. **언제부터인가.** `f3dacc7` 이전 커밋에서도 같은 조합이 깨지는지 확인한다.
   최근 머지된 #253(환경설정)·#254(문의 내역)가 테스트 수를 늘렸으므로 부하가 달라졌을 수 있다.
3. **두 테스트가 같은 원인인가.** 하나는 요청 횟수를 세고 하나는 폼 상태를 본다.
   공통 원인(전역 타임아웃·MSW 핸들러 누수)인지, 우연히 둘 다 느린 것인지 다르다.

## 범위

**이 작업은 두 테스트를 안정화한다.** 다음은 범위 밖이다.

- 다른 느린 테스트 전반의 성능 개선
- vitest 병렬 설정 변경 (원인으로 확인되면 그때 별도 판단)
- 제품 코드의 동작 변경 — 테스트가 검증하는 동작은 그대로 둔다

## 재현

```bash
pnpm exec turbo run test --force
# 통과하면 몇 번 반복한다. 단독 실행으로는 재현되지 않는다.
pnpm --filter @repo/web exec vitest run src/pages/main/ui/main-page.test.tsx src/pages/onboarding/ui/onboarding-page.test.tsx
```

## 발견 경위

FEAT-044(문제 카드 부가 조작) 착수 전 아이콘 정리를 검증하다 나왔다. 변경 내용은 SVG 3개와
생성된 아이콘 맵뿐이라 두 테스트와 인과가 없고, 재실행으로 간헐성이 확인됐다.
`work-management.md` §7에 따라 그 자리에서 고치지 않고 별도 항목으로 분리한다.
