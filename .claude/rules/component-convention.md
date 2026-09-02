# 컴포넌트 규칙

`shared/ui/button`, `icon`, `icon-button`, `spinner`가 레퍼런스다. 새 컴포넌트는 그 형태를 따른다.

---

## 1. 파일과 폴더

```
shared/ui/icon-button/
├── icon-button.tsx          # 구현
├── icon-button.stories.tsx  # Storybook (문서)
├── icon-button.test.tsx     # 동작 검증이 필요할 때
└── index.ts                 # 배럴
```

- **파일명·폴더명은 kebab-case.** 컴포넌트 이름이 PascalCase여도 파일은 kebab이다
- 테스트와 스토리는 **대상과 같은 폴더**에 둔다
- 배럴은 컴포넌트와 props 타입을 함께 내보낸다

  ```ts
  export { Spinner, type SpinnerProps } from './spinner';
  ```

## 2. 애플리케이션 모듈은 named export

컴포넌트·훅·유틸 등 애플리케이션 모듈은 named export를 쓴다. 어디서든 이름이 같아야 검색과
추적이 쉽다. Storybook meta와 빌드·도구 설정처럼 프레임워크가 default export를 요구하는 파일은
예외다.

```tsx
export function Button({ ... }: ButtonProps) { ... }   // ✅
export default function Button() { ... }               // ❌
```

## 3. 이미 있는 걸 먼저 쓴다

같은 의미의 컴포넌트를 새로 만들지 않는다. `shared/ui/`를 먼저 본다.

```tsx
// ✅
import { Button } from '@/shared/ui/button';

// ❌ 같은 의미인데 새로 만든다 — 디자인이 갈라진다
const SubmitButton = () => <button className="rounded-8 bg-cta px-5 …">…</button>;
```

기존 컴포넌트로 표현이 안 되면 **그 컴포넌트에 variant를 추가**하는 게 먼저다.
정말 다른 것이면 새로 만들되, 왜 기존 것으로 안 되는지 한 줄로 남긴다.

### 복합 인터랙션은 검증된 primitive를 우선 검토한다

단순 표시와 기본 입력은 semantic HTML과 기존 `shared/ui`로 구현한다. 반면 아래처럼 브라우저 기본
동작만으로 접근성을 충족하기 어려운 복합 위젯은 처음부터 직접 구현하는 것을 기본값으로 삼지 않는다.

- dialog · drawer · sheet
- popover · tooltip
- dropdown menu · context menu
- combobox · select
- 키보드 이동 규칙이 있는 tabs

이 컴포넌트들은 포커스 진입·복귀와 trap, 키보드 조작, 접근 가능한 이름, 바깥 영역 비활성화,
Portal, 레이어 순서, 스크롤 잠금처럼 서로 연결된 동작을 함께 처리해야 한다. 검증된 headless
primitive를 사용하면 이 기반 동작을 재구현하고 장기간 유지하는 위험을 줄일 수 있다.

Radix 같은 headless primitive나 shadcn/ui 구현을 후보로 검토할 수 있다. shadcn/ui는 필요한 코드를
저장소로 가져와 직접 소유하는 방식이므로, 가져온 뒤에는 이 프로젝트가 코드 품질과 업데이트를
책임진다. 접근성이 자동으로 완성된다고 가정하지 않는다.

도입 전에는 다음을 확인한다.

- 기존 `shared/ui`와 semantic HTML만으로 해결하기 어려운 상호작용인가
- 필요한 컴포넌트만 선택적으로 도입하는가
- 추가 런타임 의존성, 번들 영향, 라이선스와 유지보수 상태를 확인했는가
- 외부 기본 스타일과 토큰을 그대로 들이지 않고 `tokens.css`·`cn()`·cva 규칙에 맞췄는가
- 공개 API가 제품 도메인이나 특정 라이브러리의 내부 구현을 불필요하게 노출하지 않는가
- 키보드 조작, 열림·닫힘, 포커스 진입·복귀, accessible name을 테스트했는가
- drawer처럼 제스처가 있으면 터치 조작·스크롤 충돌·모션 감소 환경도 확인했는가

antd·MUI 같은 완성형 UI 시스템을 컴포넌트 하나 때문에 추가하지 않는다. 제품 전반에서 도입할
필요가 있다면 디자인 시스템, 번들, 테마, 접근성, 업그레이드 비용을 함께 비교하는 별도 기술 결정으로
다룬다.

## 4. props 타입

- 이름은 `{Component}Props`
- 객체 형태는 `interface`를 기본으로 선언하고 export 한다
- 유니온·교차·mapped type처럼 타입 조합이 필요하면 `type`을 쓴다
- DOM 속성을 넘길 컴포넌트는 `React.ComponentProps<'button'>`을 확장한다
- 기본값은 구조 분해에서 준다 — `({ size = 'md' }: Props)`
- **`any` 금지.** 불가피하면 `unknown` + 타입 가드
- 이벤트 prop은 `on + 동사` (`onSelect`, `onDismiss`), boolean은 `is*` / `has*`

```tsx
export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'> {
  size?: 'sm' | 'md';
  label?: string | null;
}
```

## 5. 변형은 cva로

시각적 변형(variant/size)은 `class-variance-authority`로 선언한다. 조건부 문자열 조합이 아니다.

```tsx
const buttonVariants = cva(['기본 클래스들'], {
  variants: {
    variant: { default: [...], secondary: [...] },
  },
  defaultVariants: { variant: 'default' },
});
```

- 클래스 병합은 **반드시 `cn()`** (`className-convention.md`)
- 호출부에서 시각 상태를 override 하지 않는다. 새 변형이 필요하면 `variants`에 정식 추가
- 레이아웃 클래스(`w-full`, `mt-4`)는 `className`으로 받아도 된다

**반응형 크기** — Tailwind는 리터럴 클래스만 스캔하므로 `md:` 접두사를 런타임에 붙일 수 없다.
`Button`의 `SIZE_CLASS` / `SIZE_CLASS_MD` 두 표가 그래서 존재한다. 값을 바꾸면 **양쪽 다** 고친다.

## 6. `data-*` 속성

컴포넌트 루트에 식별용 속성을 단다. 테스트와 CSS 셀렉터가 이걸 쓴다.

```tsx
<Comp data-slot="button" data-variant={variant} data-loading={isLoading || undefined} />
```

값이 없을 땐 `undefined`로 두어 속성 자체가 안 나오게 한다 (`false` 문자열 방지).

## 7. 접근성

- 상태는 aria로 알린다. `aria-busy`(로딩), `aria-disabled`(asChild), `aria-invalid`(검증 실패)
- 아이콘만 있는 버튼은 접근 가능한 이름이 필요하다 (`aria-label` 또는 시각적으로 숨긴 텍스트)
- 포커스 표시를 지우지 않는다. `outline-none`을 쓸 땐 `focus-visible:ring-*`을 함께 둔다
- 마우스 전용으로 만들지 않는다. 키보드로 도달·조작 가능해야 한다

## 8. 로직은 밖으로

컴포넌트는 얇게 유지한다. 계산·상태 전이는 **순수 함수나 훅으로 추출**한다.
그래야 가볍게 테스트할 수 있고 변경 전후의 동작을 검증하기 쉽다 (`test-policy.md`).

```
로직 → model/ 의 함수나 use* 훅
렌더 → 컴포넌트
```

## 9. Storybook은 문서, 테스트가 아니다

- `*.stories.tsx`는 PM·디자이너가 열어보는 **컴포넌트 상태 문서**다
- 동작 검증을 story로 대체하지 않는다. 검증은 `*.test.tsx`
- 컴포넌트당 대표 상태(기본/변형/로딩/비활성)를 story로 둔다

## 10. 파일 하나에 export 컴포넌트 하나

- 헬퍼 컴포넌트는 **비-export로 같은 파일에** 둘 수 있다
- 복합 컴포넌트는 서브디렉터리로 나누고 배럴로 묶는다

```
shared/ui/
├── spinner/spinner.tsx          # 단순
└── modal/                       # 복합
    ├── modal.tsx
    ├── modal-header.tsx
    └── index.ts
```

### `forwardRef`는 대부분 필요 없다

**React 19에서는 `ref`를 일반 prop으로 받는다.** 원본 하네스나 옛 예제를 보고
`forwardRef`를 새로 감싸지 않는다.

```tsx
// ✅ React 19
interface TextInputProps extends ComponentProps<'input'> {
  label: string;
}
export function TextInput({ label, ref, ...rest }: TextInputProps) {
  return <input ref={ref} {...rest} />;
}
```

### 명령형 ref가 필요할 때

부모가 자식의 명령형 메서드(`open()`, `submit()` 등)를 호출해야 한다면 ref를 일반 prop으로 받고
`useImperativeHandle`로 노출 범위를 제한한다. 선언적 props로 표현할 수 있는 동작에는 명령형 ref를
추가하지 않는다.

```tsx
interface ConfirmModalProps {
  ref?: Ref<ConfirmModalHandle>;
}
export function ConfirmModal({ ref, ...props }: ConfirmModalProps) {
  useImperativeHandle(ref, () => ({ open, close }));
}
```

`forwardRef`를 쓰는 **서드파티** 컴포넌트를 감쌀 때는 `displayName`을 붙인다.

## 11. `asChild`와 Radix Slot

`asChild`를 지원하는 컴포넌트는 Slot에 단일 실제 엘리먼트를 전달해야 한다. 자식을 Fragment로
감싸면 `className`·`data-*`·ARIA 속성이 대상에 전달되지 않는다. 여러 자식을 조합해야 한다면
`Slottable`로 실제 대상 엘리먼트를 명시한다.
