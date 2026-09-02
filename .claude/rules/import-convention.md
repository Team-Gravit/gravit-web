# import 규칙

훅(`fsd-layer-check.mjs`)이 강제하는 것과, 훅이 안 보지만 지켜야 하는 것을 함께 다룬다.

---

## 1. 별칭은 `@/*` 하나뿐

`tsconfig.json`의 `paths`는 `@/*` → `./src/*` **단 하나**다. 레이어별 별칭은 없다.
`vite.config.ts`와 `vitest.config.ts`에도 같은 alias가 들어 있다.

**앱마다 독립이다.** `apps/web`의 `@/`는 `apps/web/src/`를 가리킨다.

## 2. 언제 별칭, 언제 상대 경로

| 대상              | 형태                             |
| ----------------- | -------------------------------- |
| **다른 레이어**   | `@/<layer>/<slice>` — 배럴까지만 |
| **같은 slice 안** | 상대 경로 (`./`, `../`)          |
| 외부 패키지       | 패키지명                         |

```ts
// ✅ 다른 레이어 — 별칭 + 배럴
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

// ✅ 같은 slice 안 — 상대 경로
import { ICONS } from './icons.generated';
import type { IconName } from './icons.generated';

// ❌ 레이어를 넘는 상대 경로 — 훅이 차단한다
import { cn } from '../../../shared/lib/cn';
```

**왜 레이어를 넘을 때 상대 경로가 금지인가** — `../../../`는 파일이 이동하면 조용히 깨지고,
읽는 사람이 어느 레이어를 참조하는지 알 수 없다. 별칭은 레이어 이름이 경로에 드러난다.

## 3. 배럴까지만 참조한다

```ts
import { Button } from '@/shared/ui/button'; // ✅
import { Button } from '@/shared/ui/button/button'; // ❌
```

내부 파일 경로는 구현 세부사항이다.
steiger는 `shared`에서 `fsd/public-api`를 꺼놔서 **도구가 이걸 안 잡는다.** 사람이 지킨다.

예외: `shared/api/generated/`는 배럴이 없다. 생성물 경로를 그대로 쓰되,
화면이 아니라 `entities`/`features`의 `api/` segment에서만 참조한다 (`api-convention.md`).

## 4. type-only는 `import type` — 강제된다

```ts
import type { AxiosError, AxiosRequestConfig } from 'axios';
import Axios, { type AxiosError } from 'axios'; // 값과 섞이면 인라인 type
```

**`verbatimModuleSyntax: true`가 켜져 있다** (`packages/typescript-config/vite.json`).
타입을 `type` 없이 import하면 **타입 검사가 실패한다.**

```
error TS1484: 'ReactNode' is a type and must be imported using
a type-only import when 'verbatimModuleSyntax' is enabled.
```

배럴에서 타입을 re-export할 때도 마찬가지다.

```ts
export { Spinner, type SpinnerProps } from './spinner'; // ✅
export { Spinner, SpinnerProps } from './spinner'; // ❌
```

**왜 켰나** — `verbatimModuleSyntax`는 "쓴 대로 내보낸다"는 뜻이다.
타입만 쓰는 import가 런타임 import로 남는 일이 없어져 번들이 정확해지고,
무엇보다 규칙이 **문서가 아니라 컴파일러로** 지켜진다.

## 5. 정렬

Prettier는 import 순서를 건드리지 않고, ESLint에도 정렬 규칙이 없다.
**도구가 안 잡으므로 아래 순서를 사람이 지킨다.** 그룹 사이는 빈 줄로 나눈다.

```ts
import { useState } from 'react'; // 1. react / node 내장

import { useQueryClient } from '@tanstack/react-query'; // 2. 외부 패키지

import { Button } from '@/shared/ui/button'; // 3. 별칭 (@/) — 아래 레이어부터
import { UserCard } from '@/entities/user';

import { useFollow } from './use-follow'; // 4. 상대 경로
import type { FollowButtonProps } from './types';
```

3번 그룹 안에서는 `shared → entities → features → widgets → pages` 순으로 둔다.
읽는 사람이 **이 파일이 어느 레이어까지 의존하는지** 한눈에 본다.

## 6. 훅이 차단하는 세 가지

`.claude/hooks/fsd-layer-check.mjs`가 Edit/Write/MultiEdit 직전에 검사한다.

1. **상향 import** — 아래 레이어가 위 레이어를 참조
2. **cross-slice import** — 같은 레이어의 다른 슬라이스를 직접 참조
3. **레이어를 넘는 상대 경로**

정적 import뿐 아니라 **동적 `import()`와 `require()`도** 잡는다.

차단되면 사유가 반환된다. **우회하지 말고 사유대로 고친다.**
정말 그 참조가 필요하다면 구조가 잘못된 것이니, 공통을 아래 레이어로 내리거나
상위에서 조합하도록 바꾼다.

> 훅은 **새로 쓰는 내용만** 본다. 기존 파일에 이미 있는 위반은 `steiger`가 사후에 잡는다.
> `*.test.ts(x)`는 검사 대상이 아니다.
