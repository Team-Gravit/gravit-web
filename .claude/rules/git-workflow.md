# git 흐름 — 브랜치 · 머지 · CI

커밋 메시지 형식은 `CLAUDE.md`의 「커밋」에 있다. 이 문서는 **브랜치를 어떻게 흘려보내는가**다.

> 아래는 **이 레포의 실측 결과**다(2026-09-01, `origin` 기준). 남의 프로젝트 관행이 아니다.
> 현재 흐름은 실측 사실로, v2 출시 이후 흐름은 §5의 확정 운영 정책으로 구분한다.

---

## 1. 브랜치

| 브랜치                  | 역할                                | 분기 기준 |
| ----------------------- | ----------------------------------- | --------- |
| `main`                  | 구버전(legacy) 프로덕션 배포        | —         |
| `develop`               | **v2 작업 통합 브랜치 — 실질 기준** | —         |
| `{type}/#{이슈}/{설명}` | 작업 브랜치                         | `develop` |
| `release/{버전}`        | v2 출시 후보의 QA·안정화            | `develop` |
| `hotfix/{버전}-{설명}`  | v2 출시 후 운영 긴급 수정           | `main`    |

작업 브랜치 이름은 `feat/#181/button`, `chore/#177/spinner` 형태다.
`type`은 커밋 type과 같은 어휘를 쓴다 (`feat` `fix` `chore` `refactor` `docs` …).

> ⚠️ **`main`과 `develop`은 갈라져 있다** — `develop`이 219 커밋 앞서고 `main`이 4 커밋 앞선다.
> `main`은 아직 legacy 배포본이고 v2는 `develop`에만 있다. **분기 기준은 언제나 `develop`이다.** > `main`을 기준으로 브랜치를 따면 219 커밋 뒤처진 상태에서 시작하게 된다.

## 2. 머지

**PR 머지 커밋으로 합친다.** squash가 아니다 — `develop` 이력이 전부
`Merge pull request #N from Team-Gravit/{브랜치}` 형태다.

```
{type}/#{이슈}/{설명}  --PR-->  develop
```

- `main` · `develop` 직접 push 금지. **PR로만** 합친다
- PR 제목·본문은 한국어. 이슈 번호를 본문에 연결한다

`release/*`와 `hotfix/*`도 PR로만 합친다. 이 저장소는 PR merge commit 이력을 유지하므로
squash 또는 rebase merge로 머지 방식을 섞지 않는다.

## 2-1. 작업 브랜치를 develop 최신으로 맞출 때 — **rebase**

작업 중 `develop` 이 앞서 나가면 **rebase 로 따라간다.** merge 로 끌어오지 않는다.

```bash
git fetch origin
git rebase origin/develop
git push --force-with-lease origin <브랜치>
```

**왜 rebase 인가** — 작업 브랜치에 `Merge branch 'develop' into ...` 커밋이 쌓이면
PR 이력이 실제 변경과 무관한 커밋으로 지저분해진다. 리뷰어가 "이 PR 이 무엇을 바꾸는가"를
읽기 어려워진다. `git-workflow` §2 의 머지 커밋 규칙은 **PR → develop 방향에만** 적용된다.

**`--force`가 아니라 `--force-with-lease`를 쓴다.** 그 사이 원격이 바뀌었으면 거부되어
남의 커밋을 덮어쓰지 않는다.

> ⚠️ **다른 사람이 그 브랜치에서 작업 중이면 rebase 하지 않는다.** 그 경우에만 merge 를 쓰고
> 사유를 PR 에 남긴다. 혼자 쓰는 브랜치가 기본이다.

### 커밋을 정리할 때

리뷰 전이라면 관련 커밋을 합쳐 의미 단위로 만든다. `fix: 오타`, `수정` 같은 커밋을
그대로 올리지 않는다. 정리 후에도 **최종 결과물이 같은지 반드시 확인한다.**

```bash
git diff <정리 전 백업> HEAD    # 차이가 의도한 것뿐인지
```

**정리 전에 백업 브랜치를 만든다.** 이력을 다시 쓰는 작업은 되돌릴 지점이 있어야 한다.

```bash
git branch backup/<설명>
```

#### 편집기 없이 rebase 하기

AI 도구는 대화형 편집기를 열 수 없다. 대신 **편집기를 스크립트로 대체**하면
`rebase -i`를 그대로 쓴다. `GIT_SEQUENCE_EDITOR`는 todo 목록을, `GIT_EDITOR`는 커밋
메시지를 다룬다.

```bash
# 메시지 일괄 수정
GIT_SEQUENCE_EDITOR="sed -i 's/^pick/reword/'" GIT_EDITOR="sed -i 's/(#196)/(#197)/'" git rebase -i <base>

# fixup 접기 — sed 조작도 필요 없다
git commit --fixup=<sha>
GIT_SEQUENCE_EDITOR=true GIT_EDITOR=true git rebase --autosquash -i <base>
```

**`filter-branch`는 쓰지 않는다.** git 자체가 권장을 거두는 명령이고, 위 방식으로
같은 일을 더 안전하게 할 수 있다.

> rebase 중 충돌이 나면 멈춘다. 해결 후 `git rebase --continue`, 되돌리려면 `--abort`.

## 3. CI — 무엇이 자동으로 돌고 무엇이 안 도는가

| 시점                       | 수단                                           | 동작                                                      |
| -------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| 커밋 직전                  | `.husky/pre-commit` → `lint-staged.config.mjs` | staged 파일만 prettier·eslint로 검사 (`--max-warnings=0`) |
| 커밋 메시지 저장 시        | `.husky/commit-msg` → `commitlint.config.mjs`  | Conventional Commits 형식 검사                            |
| `develop` · `main` 대상 PR | `.github/workflows/verify.yml`                 | `pnpm verify` 전체                                        |
| `develop`에 push           | `.github/workflows/storybook.yml`              | Storybook 빌드 → GitHub Pages 배포                        |

커밋 훅은 `pnpm install`의 `prepare`(husky)로 설치된다. 커밋 훅은 빠른 검사만 한다 — steiger · 타입 ·
테스트 · 빌드는 파일 단위로 돌릴 수 없거나 오래 걸려 PR 검사와 `pnpm verify`의 몫이다.

**커밋 메시지는 콜론 앞에 공백을 두지 않는다.** `feat(web): 설명` ✅ · `feat(web) : 설명` ❌

PR을 올리기 전에 로컬에서도 같은 검사를 돌린다.

```bash
pnpm verify   # format:check → lint → check-types → test → build
```

`format:check`가 실패하면 `pnpm format`으로 고친다. 완료된 작업 기록(`work/done/`)은 검사 대상이 아니다.

> `--no-verify`로 커밋 훅을 건너뛰지 않는다. 훅이 막으면 사유대로 고친다.

## 4. AI가 지킬 것

- **커밋과 push는 사용자가 요청할 때만 한다.** 임의로 하지 않는다 (`CLAUDE.md`와 동일)
- `main` · `develop`에서 직접 작업하지 않는다. 작업 브랜치를 `develop`에서 딴다
- PR을 올리는 절차는 `ai-deliver` 스킬이 생기면 그쪽으로 간다. 아직 없다

## 5. v2 출시와 이후 운영

### 5-1. 첫 출시 전

현재 `main`은 legacy 운영 브랜치이고 `develop`은 v2 통합 브랜치다. 첫 v2 출시 전까지는
`main`을 `develop`에 합치거나 v2 작업을 `main`에서 분기하지 않는다.

출시 후보가 정해지면 `develop`에서 `release/{major}.{minor}.{patch}`를 만든다. release에서는
새 기능을 추가하지 않고 QA에서 발견한 결함, 버전 정보, 출시 설정만 수정한다.

```text
작업 브랜치 → develop → release/x.y.z → v2 첫 출시 전환 → main → tag vx.y.z
```

`main`과 `develop`은 이미 크게 갈라져 있으므로 첫 전환을 일반적인 merge 명령으로 처리하지 않는다.
별도 출시 작업에서 두 브랜치의 최종 트리, 배포 설정, 되돌리기 지점을 검증하고 사용자가 승인한
전환 계획으로 한 번만 수행한다. **이 일회성 전환이 끝난 뒤부터 아래 상시 흐름을 적용한다.**

### 5-2. 첫 출시 후 상시 흐름

일반 출시는 다음 순서다.

```text
작업 브랜치 → develop → release/x.y.z → main → tag vx.y.z
                                      └→ develop 동기화
```

1. `develop`에서 `release/x.y.z`를 분기한다.
2. QA·안정화 수정은 release 대상 PR로만 반영한다.
3. 승인된 release를 PR merge commit으로 `main`에 합친다.
4. 프로덕션 대상으로 승인된 `main` 커밋에 annotated tag `vx.y.z`를 만든다.
5. release에서 생긴 수정이 빠지지 않도록 `main`을 PR로 `develop`에 동기화한다.
6. 동기화가 끝나면 원격 release 브랜치를 삭제한다. 출시 기록은 tag로 보존한다.

운영 긴급 수정은 다음 순서다.

```text
main → hotfix/x.y.z-설명 → main → tag vx.y.z → develop 동기화
```

hotfix에는 해당 운영 결함 수정만 넣는다. `main` 반영과 태그 생성 후 같은 변경을 PR로
`develop`에 동기화한다.

### 5-3. 버전 태그

태그는 `v{major}.{minor}.{patch}` 형식의 Semantic Versioning을 사용한다.

- `major`: 호환되지 않는 제품·계약 변경
- `minor`: 하위 호환 기능 추가
- `patch`: 하위 호환 버그 수정

태그는 브랜치를 대신하지 않는다. 배포 대상으로 승인된 `main`의 정확한 커밋을 가리키는
출시 기록이며, 이동하거나 같은 버전으로 다시 만들지 않는다.

### 5-4. PR 필수 검사

PR 검사 워크플로(`verify.yml`)는 `INFRA-010`에서 도입했다. 저장소 branch protection에서 `verify`
check를 `develop` · `main`의 필수 통과 조건으로 지정하면, 실패한 PR은 머지할 수 없다.
