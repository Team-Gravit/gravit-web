# work/ — 작업 흐름 문서

작업 하나가 **폴더 하나**다. 폴더는 `to-do/ → in-progress/ → done/` 사이를 **통째로** 이동한다.

> `docs/`와의 차이: `docs/`는 **상태가 없는 기준 문서**(항상 최신), `work/`는 **상태가 있는 흐름 문서**(끝나면 동결).

---

## 폴더 이름 규칙

```
{ID}-{짧은-설명}
```

| prefix   | 작업 종류                  | 하네스 mode          | 주된 경로                                                                 |
| -------- | -------------------------- | -------------------- | ------------------------------------------------------------------------- |
| `FEAT-`  | 신규 기능                  | `feature`            | feature-planner → issue-reviewer → ai-plan → ai-orchestrate → ai-validate |
| `MIG-`   | legacy-web → apps/web 이전 | `migrate`            | refactor-baseline → design-diff → ai-plan → ai-orchestrate → ai-validate  |
| `REF-`   | 구조 리팩터 (이전이 아닌)  | `refactor`           | ai-plan(refactor-checklist) → ai-orchestrate → ai-validate                |
| `FIX-`   | 시안 대조 수정 / 버그      | `design-fix` / `fix` | design-diff → ai-quick 또는 ai-plan                                       |
| `NAT-`   | native 기능                | `feature`            | expo:\* 스킬 + ai-plan                                                    |
| `INFRA-` | 하네스 · 빌드 · CI         | `infra`              | ai-quick                                                                  |

**번호는 prefix별이 아니라 전역 통번호다.** `MIG-001`, `REF-002`, `FIX-003` … 그래야 시간 순서가 보인다.

예: `work/in-progress/MIG-001-학습화면-이전/`

---

## 작업 폴더 안에 들어가는 것

| 파일            | 누가 만드나                                          | 필수              |
| --------------- | ---------------------------------------------------- | ----------------- |
| `spec.md`       | 사람 (+ `refactor-baseline`이 현행 동작 기준선 추가) | ✅                |
| `plan.md`       | `ai-plan`                                            | ✅                |
| `issues.md`     | `feature-planner`                                    | FEAT/NAT          |
| `issue-{N}.md`  | 향후 `test-scenarios`                                | 예약(현재 미사용) |
| `checklist.md`  | `ai-validate`                                        | ✅                |
| `retrospect.md` | 선택 회고 (향후 `ai-retrospect` 도입 시 회차 누적)   | 선택              |
| `assets/`       | 사람 (Figma 내보내기 등)                             | 선택              |

새 작업은 `TEMPLATE/`을 복사해서 시작한다.

```bash
cp -r work/TEMPLATE "work/to-do/MIG-001-학습화면-이전"
```

### Work task와 GitHub Issue의 관계

하나의 work task는 목표와 완료 상태를 관리하고, 큰 `FEAT-`·`NAT-` 작업은 여러 실행 이슈로
나눌 수 있다. **실행 이슈 하나는 GitHub Issue 하나와 정확히 연결한다.**

```text
FEAT-011
├─ issue-01.md ↔ GitHub Issue #234
└─ issue-02.md ↔ GitHub Issue #235
```

파일명은 work task 내부 순번인 `issue-01.md` 형식을 쓴다. GitHub Issue 번호는 등록 후 생기므로
파일명에 넣지 않고 `issue-N.md`의 `github_issue` frontmatter와 `issues.md` 링크에 기록한다.

---

## 상태 이동

```
to-do/          작성만 됨. 아직 시작 안 함
   ↓ ai-plan 승인 시 이동
in-progress/    현재 작업 중          ← 스킬이 !ls 로 자동 스캔하는 곳
   ↓ 검증 + 필요한 docs/ 기준 문서 갱신 후 이동
done/           동결. 수정하지 않음
```

> **`in-progress/`에는 하나만 둔다.** 스킬이 여기를 "지금 하는 일"로 읽기 때문에,
> 여러 개가 있으면 AI가 어느 것을 작업 중인지 판단하지 못한다.

---

## `docs/`로의 승격

작업이 끝나면 **확정된 명세는 `docs/`로 승격**된다. 이게 "명세 미반영"을 잡는 회로다.

| work/ 의 산출                     | →   | docs/ 의 기준 문서                     |
| --------------------------------- | --- | -------------------------------------- |
| 화면 구현·검증 상태               | →   | `docs/implementation-status.md`        |
| `MIG-`의 legacy 대체 완료 사실    | →   | `docs/migration-status.md`             |
| `spec.md`의 확정 명세 · 검증 기준 | →   | `docs/fe-implement-spec/{화면ID}/`     |
| 새로 정한 토큰 · 컴포넌트 규격    | →   | `docs/design-system/`                  |
| 새로 합의된 코드 규칙             | →   | `docs/conventions/` + `.claude/rules/` |

승격하지 않고 `done/`에만 남기면, 다음 작업은 그 결정을 모른 채 시작한다.
