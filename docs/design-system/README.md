# Gravit 디자인 시스템

UI·스타일 작업의 진입점.

> **Source of Truth = Figma 시안 + `apps/web/src/app/styles/tokens.css`.**
> 이 문서는 두 소스를 사람이 읽기 쉽게 정리한 것이며, **값이 어긋나면 위 둘이 이긴다.**
> 판단 규칙은 `.claude/rules/design-source-policy.md`.

---

## 1. 이 문서가 다루지 않는 것 — 토큰 값은 Storybook에 있다

**토큰의 실제 값은 여기 적지 않는다.** 이미 Storybook Foundations 문서가 렌더링하고 있고,
값을 두 곳에 적으면 한쪽이 반드시 낡는다.

| 알고 싶은 것          | 볼 곳                                                     |
| --------------------- | --------------------------------------------------------- |
| 색 팔레트 · 토큰 이름 | Storybook `Foundations/Colors` (`src/stories/colors.mdx`) |
| 타입 스케일 17종      | Storybook `Foundations/Typography` (`typography.mdx`)     |
| radius 8종            | Storybook `Foundations/Radius` (`radius.mdx`)             |
| 아이콘 87종 목록      | Storybook `Iconography` (`Iconography.mdx`)               |
| **정의 원본**         | `apps/web/src/app/styles/tokens.css`                      |

```bash
pnpm --filter @repo/web storybook
```

**그래서 이 폴더가 소유하는 것은 값이 아니라 상태다** — 무엇이 확정이고, 무엇이 미확정이며,
무엇을 언제 제거해야 하는가.

## 2. 근거 자료 (Figma)

| 페이지                         | 링크                                                                                             | 기준 크기 | 프레임 |
| ------------------------------ | ------------------------------------------------------------------------------------------------ | --------- | -----: |
| **WEB** (`11802:29211`)        | [Copy link](https://www.figma.com/design/hu4c6qCEMB62qHXk2v8Gsl/-New-Gravit?node-id=11802-29211) | 1920×1080 |     55 |
| **AOS** (`11802:29212`)        | [Copy link](https://www.figma.com/design/hu4c6qCEMB62qHXk2v8Gsl/-New-Gravit?node-id=11802-29212) | 360×740   |     59 |
| **Alias Token** (`8240:13750`) | [Copy link](https://www.figma.com/design/hu4c6qCEMB62qHXk2v8Gsl/-New-Gravit?node-id=8240-13750)  | —         |      — |

**색 토큰의 기준은 Alias Token 페이지다.** 화면 노드에서 `get_variable_defs`로 나오는 값은
옛 값·로컬 오버라이드·이름 오타(`icon-defult`)가 섞여 있어 기준이 될 수 없다.

파일 키 `hu4c6qCEMB62qHXk2v8Gsl` · 페이지 `2차 에자일`. 화면 ID 체계는
[`../fe-implement-spec/README.md`](../fe-implement-spec/README.md) §4.

## 3. 토큰 확정 상태

**대조일 2026-09-01** — 디자이너의 **Alias Token 페이지**(`8240:13750`)를 기준으로 `tokens.css`와 기계 비교했다.

| 토큰 그룹  | 상태              | 근거                                            |
| ---------- | ----------------- | ----------------------------------------------- |
| Color      | ✅ **29/29 일치** | Alias Token 페이지의 색상 칩과 전부 같다 (§3-1) |
| Typography | ✅ 확정           | 17종. `typography.mdx`                          |
| Radius     | ✅ 확정           | 8종. **DX를 위해 우리가 정한 것** (§3-2)        |
| Breakpoint | ✅ 확정           | 코드 기준. Figma에 정의 없음                    |
| Spacing    | ⬜ **없음**       | Figma 디자인 시스템에 정의되지 않았다 (§3-3)    |
| Shadow     | ⬜ **없음**       | 〃 (§3-3)                                       |
| Grid       | ⬜ **없음**       | 〃                                              |

### 3-1. ⚠️ 대조는 **색상 칩**을 기준으로 한다

Alias Token 페이지에는 **손으로 타이핑한 hex 텍스트**와 **변수에 바인딩된 색상 칩**이 함께 있는데,
**둘이 어긋난 곳이 있다.** 칩이 실제 변수 값이고, 텍스트는 갱신이 안 된 문서다.

| 토큰         | 문서 텍스트 | **실제 칩** |
| ------------ | ----------- | ----------- |
| `bg-1`       | #FFFFFF     | **#F8F8F8** |
| `success`    | #00C30D     | **#4CAF50** |
| `icon-color` | #BE21FF     | **#BA00FF** |

**hex 텍스트를 근거로 삼지 않는다.** 실제로 과거에 그 텍스트를 보고
`bg-1`을 `#FFFFFF`로 고친 커밋(`fe6b675`)이 있었고, 그게 이번에 되돌려졌다.

2026-09-01에 칩 기준으로 **5건을 맞췄다.**

| 토큰         | 이전      | 이후                                |
| ------------ | --------- | ----------------------------------- |
| `main`       | `#BE21FF` | **`#BA00FF`** (purple-500 → 600)    |
| `icon-color` | `#BE21FF` | **`#BA00FF`**                       |
| `bg-1`       | `#FFFFFF` | **`#F8F8F8`** (gray-0 → gray-100)   |
| `text-2-w`   | `#F2F2F2` | **`#DCDCDC`** (gray-200 → gray-300) |
| `success`    | `#00C30D` | **`#4CAF50`**                       |

`main`과 `icon-color`가 함께 움직인 것으로 보아 **브랜드 컬러 변경**으로 보인다.
디자이너 확인 대기 — `work/to-do/FIX-007-*`.

### 3-2. radius — 우리가 정한 것

Figma 디자인 시스템에 radius 정의가 없다. **DX를 위해 숫자 토큰 체계를 우리가 만들었다**
(`rounded-8` = 8px). `--radius-*: initial`로 Tailwind 기본 t-shirt 스케일을 지웠으므로
`rounded-lg` 같은 이름은 **존재하지 않는다.**

### 3-3. spacing · shadow — 디자인 시스템에 없다

화면 노드를 조회하면 `padding-l` `margin-s` `gap/3` 같은 변수와 그림자 이펙트가 나오지만,
**Alias Token 페이지에 정의된 것이 아니다.** 화면에서 개별로 쓰인 값이거나 문서 페이지 자체의
레이아웃 값이다. 디자이너가 관리하는 토큰이 아니므로 **이식 대상이 아니다.**

- spacing이 필요하면 **Tailwind 기본 스케일**을 쓴다
- **그림자는 임의로 추가하지 않는다.** 필요해지면 디자이너에게 정의를 요청한다

## 4. 정리 대상 토큰 대장 — **51개**

`tokens.css:130`의 TODO 주석 아래에 있는 호환 토큰들이다. legacy와 `apps/web` 양쪽에 신규·호환
토큰이 섞여 있어 화면 이전률과 제거 개수는 비례하지 않는다. 이 표는 migration 진척률이 아니라
**디자인 시스템 부채와 실제 사용처**를 추적한다.

> ⚠️ **"주석 아래 = 전부 제거 대상"이 아니다.** 주석 아래 선언 56개 중
> `--breakpoint-sm/md/lg/xl`(Tailwind v4의 `md:` 반응형 변형을 정의 — `button.tsx`가 실제로 쓴다)와
> `--font-pretendard`(본문 폰트, `base.css`가 쓴다) **5개는 제거 대상이 아니다.**
> 더 아래 223행부터의 **`--text-*` 타이포 토큰 17종(선언 68개 = 17스타일 × 4속성)은 정식 스케일이다.**
> 경계를 착각하면 살아 있는 토큰을 지우게 된다.

| 묶음                                                   |   개수 | 현재 사용처                                 |
| ------------------------------------------------------ | -----: | ------------------------------------------- |
| `--color-gray-*: initial` + `--color-gray-100~900`     |     10 | `privacy-page` · `terms-page`               |
| 배경·버튼 (`bg-gray` `kakao-btn` `black`)              |      3 | 미사용                                      |
| `--background-image-main-gr`                           |      1 | 미사용                                      |
| **죽은 텍스트 토큰** (`--color-text1` `--color-text2`) |      2 | **미사용 — 새 코드에서 쓰지 않는다**        |
| 티어 (`bronze`~`diamond`)                              |      5 | 미사용                                      |
| main 계열 (`main-1` `main-hover` `main-2` `main-end`)  |      4 | 홈 스캐폴드가 `main-1` 사용                 |
| 학습 헤더 (`neutral-20/60/100`)                        |      3 | 미사용                                      |
| 학습 문제영역 (`correct` `error` `error-info`)         |      3 | 미사용                                      |
| 프로필 (`profile-1`~`10`)                              |     10 | 미사용                                      |
| 번호 (`--color-3`)                                     |      1 | 미사용                                      |
| `--font-mbc`                                           |      1 | 미사용                                      |
| 헤더·탭 높이 (`header-height` 외 3)                    |      4 | **`privacy-page` · `terms-page` (MIG-004)** |
| 애니메이션 (skeleton 2 · fade 2)                       |      4 | fade 2종만 `utilities.css`                  |
| **합계**                                               | **51** |                                             |

**규칙**

- **새 화면에서 이 토큰을 새로 쓰지 않는다.** 정식 토큰(`text-1` `bg-1` `main` `cta` …)을 쓴다
- 제거 전 `apps/web`과 `apps/legacy-web`의 실제 사용처를 검색한다
- 사용처가 0이고 대체 토큰이 확정된 항목만 별도 `FIX-` 또는 `REF-` 작업에서 제거한다
- 개수 감소는 디자인 시스템 정리 상태일 뿐 화면 구현 또는 legacy 폐기 완료를 의미하지 않는다

## 5. 컴포넌트

컴포넌트 변형은 Storybook, 사용 규칙은 `.claude/rules/component-convention.md` 에 있다.

## 6. DO / DON'T는 여기 없다

사용 규칙은 문서를 나누지 않고 `.claude/rules/`에 한 벌만 둔다. 두 곳에 두면 갈라진다.

| 알고 싶은 것                                    | 볼 곳                     |
| ----------------------------------------------- | ------------------------- |
| 토큰 하드코딩 금지 · `cn()` · 조건부 className  | `className-convention.md` |
| cva variant · 접근성 · 파일 구조                | `component-convention.md` |
| Figma가 기준 · MCP 생성 코드 금지 · 미확정 토큰 | `design-source-policy.md` |
