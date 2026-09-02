---
name: ai-quick
description: >
  가벼운 코드 변경 요청의 단축 경로. 계획 문서나 산출물 파일 없이 룰만 적용하고,
  변경된 파일에 한정해 가볍게 검증한 뒤 커밋 메시지를 제안한다.

  "이거 좀 고쳐줘", "이 문구 바꿔줘", "버튼 색 바꿔줘", "이 컴포넌트 옮겨줘" 처럼
  즉석에서 들어오는 작은 요청에 사용한다. 사용자가 스킬 이름을 말하지 않아도
  요청이 가볍다고 판단되면 이 절차를 따른다.

  이 스킬은 work/ 에 문서를 만들지 않는다. 커밋도 직접 하지 않는다.
---

# ai-quick

작은 요청을 **빠르게, 그러나 규율 있게** 처리한다.

품질 가드(`.claude/rules/`, steiger)는 무거운 작업과 **완전히 동일하게** 적용된다.
달라지는 건 ceremony 뿐이다 — 계획서를 안 쓰고, 산출물 파일을 안 남기고, 전체 빌드를 안 돌린다.

---

## 쓰지 말아야 할 때

아래 중 **하나라도** 해당하면 이 스킬을 쓰지 않는다. 멈추고 사용자에게 정식 절차를 권한다.

- `work/`에 해당 작업 항목이 이미 있다
- 변경될 파일이 **5개를 넘을 것 같다**
- import 영향이 여러 슬라이스로 퍼진다
- **새 슬라이스를 신설**해야 한다 (`entities/`·`widgets/` 첫 생성 포함)
- `apps/legacy-web`에서 `apps/web`으로 **이전**하는 작업이다 (→ `MIG-`)
- Figma 시안과 대조가 필요하다 (→ `design-diff`)
- orval 재생성 · 라우트 트리 · 인증 흐름이 얽힌다
- 동작 변경과 구조 변경이 **한 번에** 들어간다

> 시작한 뒤에 위 조건이 드러나도 마찬가지다. **그 자리에서 멈추고** 승격을 권한다.
> 이미 고친 게 있으면 무엇을 고쳤는지 보고한다.

### 승격을 권할 때 이렇게 말한다

말없이 계속 진행하지 않는다. **판단을 사용자에게 넘긴다.**

```
⚠️ 이 변경이 quick 범위를 넘습니다.

  이유: {조건 — 예: 변경 파일이 7개로 늘어남 / entities 신설이 필요함}
  지금까지 한 것: {있으면 나열, 없으면 "없음"}

권장: work/ 에 작업 항목을 만들고 ai-plan 으로 진행

권장: 범위를 줄이거나 정식 작업으로 승격한 뒤 계속
```

quick 제외 조건은 사용자 확인으로 무시하지 않는다. 사용자는 범위를 줄이거나 정식 작업으로
승격하는 방향을 선택할 수 있다.

---

## 절차

### 0. 컨텍스트 확인

- `CLAUDE.md` — 명령어와 함정 목록
- 관련 룰 — 스타일이면 `className-convention.md`, 값 추출이면 `constants-convention.md`
- `git status --porcelain` — 이미 작업 중인 변경이 섞여 있는지

### 1. Intent 선언 (한 줄)

작업 전에 무엇을 할 건지 한 줄로 선언한다. 이게 이 스킬의 유일한 "계획"이다.

```
intent: fix · scope: shared/ui/button · 예상 파일 1~2개
```

- **kind**: `feat` / `fix` / `refactor` / `style` / `chore`
- **scope**: 건드릴 슬라이스 1~3개
- **예상 파일 수** — 여기서 5개를 넘으면 위 "쓰지 말아야 할 때"로 간다

모호하면 **딱 한 번** 확인 질문을 한다. 두 번 이상 물어야 하면 요청이 가벼운 게 아니다.

### 2. 변경 수행

변경 대상에 맞는 `.claude/rules/` 문서를 읽고 적용한다. 코드 규칙을 이 스킬에 다시 요약하지
않는다. 충돌하면 `.claude/rules/`가 정본이다. 계획 범위 밖 문제는 함께 고치지 않는다.

### 3. Lite 검증 — 변경 파일 한정

**전체 빌드를 돌리지 않는다.** 무거운 요청이 아니므로 검증도 가볍게 한다.

> ⚠️ **경로 기준이 도구마다 다르다.** 여기서 실수가 가장 많이 난다.
> `pnpm --filter @repo/web exec ...`는 **cwd가 `apps/web`**이라 `apps/web/` 접두사를 떼야 하고,
> 루트에서 도는 `prettier`는 **레포 기준 경로**를 그대로 받는다.

`git status --short`에서 이번 요청이 변경한 파일만 식별해 명시적 목록으로 넘긴다. 사용자의 기존
변경을 섞거나 셸별 명령 치환에 의존하지 않는다.

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web exec eslint <apps/web 기준 변경 파일...>
pnpm --filter @repo/web lint:fsd
pnpm exec prettier --check <저장소 기준 변경 파일...>
```

대상 소스가 없으면 해당 검사를 건너뛰고 보고에 `해당 없음`을 남긴다. 빈 파일 목록으로 도구를
실행하지 않는다.

테스트 파일을 건드렸거나 로직을 바꿨으면 **관련 테스트만** 돌린다.

```bash
pnpm --filter @repo/web exec vitest run <apps/web 기준 경로>
pnpm --filter @repo/web exec vitest run -t "테스트 이름"   # 단건
```

전부 통과하지 않으면 고치고 다시 돌린다. **3회 넘게 실패하면 멈추고 보고한다.**

빌드 설정·엔트리·패키지 계약처럼 결과물 생성에 직접 영향을 주는 작은 변경은 관련 build도
실행한다. 검증 범위가 여러 앱으로 퍼지면 quick을 중단하고 정식 작업으로 승격한다.

> `pnpm format:check`는 전체를 보므로 여기서 쓰지 않는다.
> 커밋된 6개 파일이 이미 실패 중이다 (`REF-003`). 이번 요청이 변경한 파일만
> `pnpm exec prettier --check`로 본다.

### 4. 보고

```
Intent   fix · shared/ui/button

Check
  check-types  ✅
  eslint       ✅ (변경 파일 2개)
  steiger      ✅
  prettier     ✅
  test         ✅ 3 passed

Changed
  apps/web/src/shared/ui/button/button.tsx
  apps/web/src/shared/ui/button/button.test.tsx

Suggested commit
  fix(web): Button 로딩 상태에서 클릭이 막히지 않던 문제 수정
```

### 5. 산출물 파일을 만들지 않는다

- `work/`에 폴더를 만들지 않는다
- 계획서·체크리스트·회고를 쓰지 않는다
- **커밋하지 않는다.** 메시지 제안까지가 끝이고, 방아쇠는 사용자가 당긴다

단 **작업 중 범위 밖의 문제를 발견하면** 그건 예외다.
그 자리에서 고치지 말고, 보고에 한 줄로 남긴다.
사용자가 원하면 `work/to-do/`에 항목으로 뽑는다 (`work-management.md` §7).

```
발견: Spinner 가 aria-live 를 안 걸고 있음. 이번 범위 밖이라 손대지 않음.
      항목으로 뽑을까?
```
