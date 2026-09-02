# Gravit Web v2

**작업 규칙의 정본은 [`CLAUDE.md`](./CLAUDE.md)다.** 도구와 무관하게 그 문서를 그대로 따른다.

> **작업을 시작하기 전에 `CLAUDE.md`를 먼저 읽는다.**
> 이 파일은 포인터일 뿐이라 여기에는 규칙을 적지 않는다 —
> 같은 규칙을 두 파일에 적으면 반드시 한쪽이 낡는다. 실제로 그런 적이 있다.

## 어디에 무엇이 있나

| 대상          | 위치                                                 |
| ------------- | ---------------------------------------------------- |
| 프로젝트 헌법 | `CLAUDE.md`                                          |
| 규칙 19종     | `.claude/rules/`                                     |
| 워크플로 스킬 | `.claude/skills/`                                    |
| 서브에이전트  | `.claude/agents/`                                    |
| FSD 경계 훅   | `.claude/hooks/fsd-layer-check.mjs`                  |
| 기준 문서     | `docs/` (design-system · 화면 명세 · 구현/폐기 대장) |
| 작업 문서     | `work/{to-do,in-progress,done}/`                     |

디렉터리 이름이 `.claude/`지만 **도구 구분 없이 공용이다.** Codex도 이 파일들을 읽는다.
복사본을 따로 만들지 않는다.

## Codex 전용 설정

| 파일                 | 용도                                               |
| -------------------- | -------------------------------------------------- |
| `.codex/config.toml` | Figma MCP 연결                                     |
| `.codex/hooks.json`  | `PreToolUse` → `.claude/hooks/fsd-layer-check.mjs` |

훅 스크립트는 **한 벌만 둔다.** `.codex/hooks.json`이 `.claude/hooks/`의 것을 가리킨다.
