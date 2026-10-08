# 코드 품질 — 네이밍 · 표현 · 주석 · 함수

**모든 코드에 적용된다.** 리팩터 때만이 아니라 새로 쓸 때도 같다.
컴포넌트 고유 규칙은 `component-convention.md`, 파일 배치는 `fsd-*.md`.

---

## 1. 네이밍

### 의도를 드러내는 이름

아래는 **단독으로 쓰지 않는다.** 무엇에 대한 것인지가 빠져 있다.

```
data · temp · info · item · value · result · handle · get
```

```ts
const data = await getUser(); // ❌
const user = await getUser(); // ✅

const handle = () => {}; // ❌
const handleSubmit = () => {}; // ✅
```

### 접두사 규칙

| 대상          | 규칙                            | 예                                                     |
| ------------- | ------------------------------- | ------------------------------------------------------ |
| Boolean       | `is` · `has` · `should` · `can` | `isLoading` · `hasError` · `shouldRetry` · `canSubmit` |
| 이벤트 핸들러 | `handle` + 대상 + 동작          | `handleModalClose` · `handleQuizSubmit`                |
| 이벤트 prop   | `on` + 동작                     | `onSelect` · `onDismiss`                               |
| 커스텀 훅     | `use`                           | `useUserQuery`                                         |

### 약어보다 명시

```
qr ❌ → query ✅      usr ❌ → user ✅      btn ❌ → button ✅
```

관례가 굳은 것(`id`, `url`, `api`)은 예외다.

### 파일명

- **kebab-case** — 컴포넌트·훅·유틸·스토어 전부 (`icon-button.tsx`, `use-user.ts`, `user-store.ts`)
- 슬라이스 폴더도 kebab-case
- 코드 안의 이름은 컴포넌트·타입 PascalCase, 변수·함수 camelCase, 상수 SCREAMING_SNAKE_CASE

---

## 2. 표현

- **중첩 삼항 금지** — 변수로 분해하거나 early return
- **3단 넘는 중첩 회피** — guard clause로 평탄화
- **`else` 회피** — `if`가 항상 return하면 `else`를 쓰지 않는다
- **항상 중괄호** — 한 줄 `if`도 `{ }`

```ts
// ❌
if (!user) return null;
else if (user.isAdmin) return <Admin />;
else return <User />;

// ✅
if (!user) return null;
if (user.isAdmin) return <Admin />;
return <User />;
```

**매직 넘버는 제거하되**, `constants-convention.md`의 "인라인 처리" 기준은 그대로 지킨다.
레이아웃 수치는 매직 넘버가 아니다.

---

## 3. 주석

주석은 코드를 번역하지 않고, 코드만으로 알 수 없는 판단 근거와 제약을 보존한다.

- 인라인 주석은 **WHY·외부 제약·트레이드오프**를 1~2줄로 설명한다
- 복잡한 알고리즘·정규식·프로토콜은 필요한 범위에서 WHAT도 설명한다
- 긴 배열이나 설정은 짧은 구역 라벨로 탐색을 돕는다
- JSDoc은 공개 API나 호출 순서·부작용·예외 같은 계약이 중요한 함수에만 사용한다
- TypeScript 타입과 이름으로 알 수 있는 내용을 `@param`·`@returns`로 반복하지 않는다
- 긴 배경은 `docs/`로 옮기고 코드에는 핵심 이유와 링크만 남긴다
- 임시 조치는 작업 일지 대신 제거 조건을 기록한다
- 코드 변경 시 함께 갱신할 수 없는 주석은 작성하지 않는다
- 삭제한 코드의 흔적은 남기지 않는다. 이력은 Git에서 확인한다

```ts
// ❌ 코드가 이미 말하고 있다
// user를 가져온다
const user = await getUser();

// ✅ 왜 이렇게 했는지
// tailwind-merge 는 커스텀 타이포 토큰을 색상으로 오인한다. 등록하지 않으면 font-size 가 사라진다.
const twMerge = extendTailwindMerge({ ... });
```

구조를 빠르게 훑게 하는 짧은 라벨도 허용한다.

```ts
const buttonClasses = [
  // 레이아웃
  'inline-flex items-center',
  // 상호작용
  'cursor-pointer disabled:pointer-events-none',
];
```

JSDoc은 타입을 되풀이하지 않고 호출자가 알아야 할 계약을 설명한다.

```ts
/**
 * 인증 처리 구현을 HTTP 계층에 주입한다.
 * 앱 부팅 시 한 번 호출하며, 이후 호출은 기존 설정을 교체한다.
 */
export function configureAuth(config: AuthConfig): void {
  // ...
}

// ❌ 이름과 타입을 그대로 반복한다
/**
 * @param nickname 사용자 닉네임
 * @returns 정리된 닉네임
 */
function formatNickname(nickname: string): string {
  return nickname.trim();
}
```

임시 우회에는 이슈 번호보다 제거 조건이 중요하다.

```ts
// ❌ TODO: 나중에 수정

// API가 nickname을 non-null로 보장하면 이 fallback을 제거한다.
const nickname = response.nickname ?? '';
```

---

## 4. 함수

| 항목            | 기준                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| **단일 책임**   | 두 가지를 동시에 하면 분리한다 (데이터 변환 + 사이드이펙트 → 두 함수)  |
| **길이**        | 줄 수보다 책임 수를 본다. 한 함수에 여러 추상화 수준이 섞이면 분해한다 |
| **인자 수**     | 인자가 많아 의미를 읽기 어려우면 이름 있는 옵션 객체로 묶는다          |
| **반환 타입**   | 공개 API·복잡한 함수는 명시하고, 자명한 지역 함수는 추론을 허용한다    |
| **side effect** | `useEffect` · mutation · 로깅은 순수 함수와 섞지 않는다                |
| **예외**        | 에러를 삼키지 않는다. `catch`가 있으면 처리하거나 명시적으로 re-throw  |

```ts
// ❌ 에러를 조용히 삼킨다
try {
  await save();
} catch {}

// ✅ 처리하거나 다시 던진다
try {
  await save();
} catch (error) {
  toast.error('저장에 실패했습니다');
  throw error;
}
```

---

## 5. React 컴포넌트

- **한 컴포넌트 = 한 책임.** JSX가 200줄을 넘으면 서브컴포넌트로 분리
- 핸들러는 `handle*`로 이름 붙여 분리한다. JSX 안 인라인 람다는 한 줄일 때만
- **`useEffect`는 도메인 로직 둥지가 아니다.** 비즈니스 로직은 `model/`이나 api 훅으로 옮기고,
  컴포넌트는 표시와 연결만 한다

```tsx
// ❌ useEffect 안에 도메인 판단이 들어간다
useEffect(() => {
  if (score >= 60 && !hasBadge) grantBadge();
}, [score, hasBadge]);

// ✅ 판단은 model 로, 컴포넌트는 호출만
const shouldGrantBadge = canGrantBadge(score, hasBadge); // entities/badge/model
```

**로직을 순수 함수나 훅으로 빼면** 테스트가 가벼워진다 (`test-policy.md` §1).
