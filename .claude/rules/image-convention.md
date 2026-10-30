---
paths:
  - 'apps/web/src/**/*.tsx'
---

# 이미지 규칙

배경 · 장식 · 일러스트 이미지를 넣거나 바꿀 때 형식 · 크기 · 로딩 방식을 정한다.
아이콘(`shared/ui/icon`)과 로고 SVG 컴포넌트는 대상이 아니다. 근거와 측정은 `REF-054`에 있다.

---

## 1. 변환은 빌드가 한다 — 쿼리 import

`vite-imagetools`(9.0.3)가 **쿼리가 붙은 import만** 변환한다. 변환본을 저장소에 따로 두지 않고
원본 하나에서 크기 · 형식을 만든다.

```ts
// 크기별 후보 + 형식 → srcset 문자열
import bgAvif from './assets/bg.png?w=1280;1920&format=avif&quality=75&as=srcset';
import bgWebp from './assets/bg.png?w=1280;1920&format=webp&as=srcset';

// 형식만
import mobileBg from './assets/bg-mobile.png?format=webp';

// 글자 · 선이 또렷한 그림
import mascot from './assets/mascot.png?w=420&lossless&format=webp';
```

- 쿼리 import 타입은 `src/vite-env.d.ts`가 선언한다. 새 쿼리 형태를 쓰면 거기에 추가한다
- 플러그인은 `vite.config.ts` · `vitest.config.ts` · `.storybook/main.ts` 세 곳에 등록돼 있다.
  한 곳만 빠지면 테스트나 스토리만 깨진다
- **원본보다 크게 만들지 않는다.** `?w=`는 원본 폭 이하로만 준다
- 10.x 이상은 Vite 7 · Node 22가 필요하다. Vite를 올릴 때 함께 올린다

## 2. 형식

| 이미지                                        | 형식                                   | 이유                                                      |
| --------------------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| 화면을 덮는 큰 배경                           | `<picture>`로 avif(품질 75) → webp     | webp의 절반 안팎. 기본값 50은 입자 무늬가 뭉개진다        |
| 마스코트 · 행성처럼 수십 KB 이하              | webp                                   | avif를 더해도 줄어드는 양이 작다                          |
| 글자 · 선이 또렷한 그림(로고 · 캐릭터 외곽선) | 무손실 webp(`lossless`)                | 손실 압축은 외곽선이 번진다. near-lossless는 지원 안 된다 |
| 애니메이션 webp                               | **다시 인코딩하지 않는다**             | 프레임 차이만 저장된 파일이라 다시 만들면 커진다          |
| SVG 일러스트                                  | svgo로 한 번 최적화해 커밋(소수 2자리) | 런타임 변환 대상이 아니다                                 |

PNG를 새로 그대로 import하지 않는다. 원본이 PNG면 쿼리로 webp를 만든다.

## 3. 해상도 — `srcset` 전에 cover 기준 축부터 본다

원본은 **표시 크기의 2배**를 기준으로 고른다. 그런데 `object-cover` · `background-size: cover`는
상자 비율에 따라 **폭이 아니라 높이에 맞춰** 커질 수 있다.

- 상자가 이미지보다 덜 납작하면(세로로 길면) 높이 기준이다. 좁은 화면에서도 크게 그려지므로
  폭만 보고 작은 후보를 주면 **더 흐려진다.** 이 경우 `srcset` 축소를 하지 않고 형식만 바꾼다
- 높이까지 반영할 수 있으면 `sizes`에 넣는다 — 예: `sizes="max(100vw, 142vh)"`(원본 비율 1.42)
- 콘텐츠 길이에 따라 상자 높이가 달라지는 배경은 `sizes`로 알려 줄 수 없다 → 원본 유지

## 4. 로딩

| 이미지                        | 속성                                                     |
| ----------------------------- | -------------------------------------------------------- |
| 첫 화면 안 (LCP 후보 포함)    | `loading` 없음(eager). LCP 후보면 `fetchPriority="high"` |
| 첫 화면 밖 목록 · 카드        | `loading="lazy"`                                         |
| 장식 · 목록 이미지            | `decoding="async"`                                       |
| 디코딩 뒤 페이드인하는 이미지 | `lazy`를 걸지 않는다 — 준비 신호가 늦어진다              |

- 「첫 화면」 개수는 **가장 좁은 화면에서** 센다. 모바일 2열 그리드는 데스크톱 첫 줄보다 많이 보인다
- 목록 컴포넌트는 로딩 방식을 prop으로 받고 기본은 `lazy`로 둔다. 몇 개를 즉시 받을지는 목록을
  배치하는 쪽이 정한다 (예: `ChapterCard`의 `planetLoading`)
- CSS `background-image`는 늦게 발견되고 우선순위 · `lazy` · `srcset`을 쓸 수 없다. 첫 화면의 큰
  이미지는 `<img>` / `<picture>`로 그린다

### 배경을 `<img>`로 깔 때

```tsx
<div className="relative isolate">
  <picture className="contents">
    <source type="image/avif" srcSet={bgAvif} />
    <img
      src={bgWebp}
      alt=""
      decoding="async"
      className="absolute inset-0 -z-10 size-full object-cover"
    />
  </picture>
  {children}
</div>
```

`isolate`가 없으면 `-z-10` 이미지가 상자 바깥 바탕 뒤로 숨는다. `<picture>`는 `contents`로 두어
부모의 flex · grid 배치에 끼지 않게 한다.

## 5. 접근성

장식 이미지는 `alt=""`. 정보가 있는 이미지(로고 등)만 대체 텍스트를 쓴다.

## 6. 바꿨으면 확인한다

- 빌드 결과물(`apps/web/dist/assets`)에서 파일 크기 · 형식
- 모양이 같아야 하는 변경은 픽셀 비교. 기준은 **「8/255 넘게 다른 픽셀 0.1% 이하」** 로 잡는다.
  「최대 차이 n/255」는 압축 · 경로 재작성으로 테두리 몇 픽셀만 달라져도 깨진다
- 로딩 방식을 바꿨으면 대상 화면 LCP를 변경 전 빌드와 번갈아 잰다
