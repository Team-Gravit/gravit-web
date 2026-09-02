---
id: REF-002
validated: 2026-09-02
mode: refactor
---

# REF-002 검증 결과

## 1. 구현 대조

| 항목                                               | 결과 |
| -------------------------------------------------- | ---- |
| SVG가 `apps/web/src/shared/ui/icon/assets/`에 있다 | ✅   |
| 생성 스크립트가 새 입력 경로를 사용한다            | ✅   |
| `icons.generated.ts`가 새 경로를 참조한다          | ✅   |
| Storybook 안내가 새 경로를 사용한다                | ✅   |

## 2. 완료 근거

- 구현 커밋: `c978594 refactor(web): 아이콘 에셋을 icon 슬라이스 안으로 이동 (#184)`
- `shared/assets` segment 제거와 생성 스크립트 갱신이 같은 커밋에 포함됐다.
- 현재 브랜치가 해당 커밋을 포함하고 있음을 확인했다.

## 3. 기준 문서

아이콘 추가 위치는 `apps/web/src/stories/Iconography.mdx`에 반영돼 있다. 화면 구현·migration
상태를 바꾸는 작업은 아니므로 다른 기준 문서 갱신은 해당 없다.
