# className 규칙

Tailwind 클래스를 조합할 때 조용히 깨지는 지점들. **에러가 안 나고 스타일만 어긋나므로** 눈으로 잡기 어렵다.

---

## 1. 조건부 className — `false`가 문자열로 박힌다

가장 자주 나는 사고다. **JSX에서는 되는 패턴이 className 안에서는 안 되기 때문**이다.

```tsx
// JSX 자식 — React 가 boolean 을 무시한다. 아무것도 안 그려짐
{
  isActive && <Badge />;
}

// className — 템플릿 리터럴의 ${} 는 단순 문자열 보간이다.
// false 에 Boolean.prototype.toString() 이 불려 'false' 라는 단어가 들어간다
<div className={`px-4 ${isActive && 'bg-main'}`} />;
// isActive=false → class="px-4 false"
```

에러도 경고도 안 난다. 클래스 하나가 안 먹을 뿐이라 리뷰에서도 안 보인다.
`{cond && <ReactNode>}`와 생김새가 같아서 더 헷갈린다.

**해결 — 셋 중 하나**

```tsx
// ✅ 최선: cn() 이 falsy 를 걸러준다
<div className={cn('px-4', isActive && 'bg-main')} />

// ✅ 템플릿 리터럴을 꼭 써야 하면 삼항 + 빈 문자열
<div className={`px-4 ${isActive ? 'bg-main' : ''}`} />

// ❌ && 는 className 안에서 쓰지 않는다
<div className={`px-4 ${isActive && 'bg-main'}`} />
```

**className 안에서는 `&&`를 쓰지 않는다**고 기억하면 된다.

## 2. `cn()`을 쓴다 — `twMerge`를 직접 쓰지 않는다

`shared/lib/cn.ts`의 `cn()`은 **커스텀 확장이 들어간** tailwind-merge다.

- 타이포 토큰(`text-display1`, `text-body1-normal` …)을 font-size 그룹으로 등록
- 숫자 radius 토큰(`rounded-8` …)을 radius 스케일로 등록

등록이 없으면 tailwind-merge가 `text-body1-normal`을 **색상 클래스로 오인**해서
`cn('text-body1-normal', 'text-text-1')`에서 font-size가 조용히 사라진다.

```ts
// ✅
import { cn } from '@/shared/lib/cn';

// ❌ 확장이 빠져 클래스가 사라진다
import { twMerge } from 'tailwind-merge';
```

이 동작은 `cn.test.ts`가 지키고 있다. 확장을 건드리면 그 테스트가 먼저 깨진다.

## 3. 레이아웃 골격은 조건부 밖에 둔다

`flex-1` · `h-full` · `w-full`처럼 **부모 영역을 채우는 클래스**를 조건부 묶음에 함께 넣으면,
조건이 꺼질 때 **같이 빠져 레이아웃이 무너진다.** 컨테이너가 자식 크기로 쪼그라든다.

```tsx
// ❌ gate 가 false 면 flex-1 까지 사라진다
<div className={cn(gate && 'flex-1 p-6')} />

// ✅ 항상 필요한 골격은 조건부 밖으로
<div className={cn('flex-1', gate && 'p-6')} />
```

**판별 기준 한 줄** — 조건이 꺼졌을 때도 **이 요소가 부모 크기를 받아야 하는가?**
그렇다면 조건부 밖이다.

같은 이유로 두 분기에 같은 레이아웃을 중복해 쓰지 않는다. 나중에 한쪽만 고쳐진다.

```tsx
// ❌ 중복
<div className={cn(isOpen ? 'flex items-center gap-2 h-12' : 'flex items-center gap-2 h-0')} />

// ✅ 변하는 것만 조건부로
<div className={cn('flex items-center gap-2', isOpen ? 'h-12' : 'h-0')} />
```

## 4. 색·타이포·radius는 하드코딩하지 않는다

```tsx
// ❌
<p className="text-[#242424] text-[16px] rounded-[8px]" />
<p style={{ color: '#242424' }} />

// ✅ 토큰 클래스
<p className="text-text-1 text-body1-normal rounded-8" />
```

`tokens.css`의 `@theme`에 정의된 것만 쓴다. 없는 값이 필요하면 **임의 값을 박지 말고**
디자인 토큰 확정이 필요한 항목으로 보고한다.

**주의할 토큰 함정 두 가지**

- `rounded-*`는 Tailwind 기본 스케일이 아니다. `--radius-*: initial`로 기본값을 지웠으므로
  `rounded-lg` 같은 이름은 **존재하지 않는다.** 숫자 토큰(`rounded-4/6/8/10/12/16/20/24`)만 있다.
- 텍스트 색은 하이픈 있는 쪽(`text-text-1` ~ `text-text-4`)을 쓴다.
  `--color-text1` / `--color-text2`(하이픈 없음)는 아무데서도 안 쓰는 죽은 토큰이다.

## 5. 컴포넌트 variant는 cva로, 바깥에서 override 하지 않는다

```tsx
// ❌ 버튼 상태색을 호출부에서 덮어쓴다
<Button className="bg-red-500 hover:bg-red-600">삭제</Button>

// ✅ variant 로 추가한다 (buttonVariants 의 variants 에 정식 등록)
<Button variant="danger">삭제</Button>
```

호출부 override는 cva가 관리하는 상태(hover/active/disabled)와 충돌해 일부 상태에서만 색이 틀어진다.
새 스타일이 필요하면 컴포넌트의 `variants`에 정식으로 추가한다.

레이아웃 조정(`w-full`, `mt-4` 등)은 `className`으로 넘겨도 된다. **금지 대상은 컴포넌트가 소유한 시각 상태다.**
