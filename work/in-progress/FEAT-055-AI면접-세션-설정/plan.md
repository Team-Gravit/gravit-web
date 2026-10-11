---
id: 'FEAT-055'
planned: '2026-10-10'
revised: '2026-10-11'
mode: 'feature'
---

# FEAT-055 구현 계획

> 사용자 승인 후 구현한 계획. 2026-10-11 현재 범위와 검증 상태를 반영했다.

## 0. 모드 판정

`mode: feature` — legacy-web에 AI면접이 없다(`interview` 검색 0건). 신규 기능이며 API 계약은 이미 생성돼 있다.

처음에는 store·로직과 구조 마크업부터 구현했다. 이후 사용자 요청으로 반응형 카드·체크박스·진행 바·난이도·확인 화면의 스타일까지 범위를 넓혔다. Storybook과 질문 화면은 별도 범위다.

## 1. 요구사항 분해 (레이어 태그)

| #   | 요구사항                                                           | 레이어       |
| --- | ------------------------------------------------------------------ | ------------ |
| 1   | CS 주제 · 직군별 스택 조회 어댑터 (`unknown` 응답을 모델 타입으로) | `[entities]` |
| 2   | 답변 방식 · 난이도 · 직군 표시 문구(Figma 카피)                    | `[entities]` |
| 3   | 선택 초안 store — 토글·상호배타·하위 선택 초기화·초기화            | `[features]` |
| 4   | 파생 규칙 — 다음 활성 조건·이전/다음 목적지·진행 단계·요청 바디    | `[features]` |
| 5   | 세션 생성 mutation — 연타 차단·이동 콜백·실패 토스트               | `[features]` |
| 6   | 단계별 반응형 선택 UI 7종과 선행 선택 검사 규칙                    | `[features]` |
| 7   | 단계 → 경로 매핑, 홈/AI-08 이동 결정                               | `[pages]`    |
| 8   | `/interview/new/$step` 라우트(단계 검증)                           | `[app]`      |

### 1-1. 관리 포인트 식별

| 값                       | 상수 / 인라인 | 근거                                                  |
| ------------------------ | ------------- | ----------------------------------------------------- |
| 단계 ID 목록·순서        | 상수          | 라우트 파라미터 검증과 목적지 계산이 같은 목록을 공유 |
| 직군 카드 헤드·서브 문구 | 상수          | `stackGroup` 키 → 문구 매핑. 04·07 두 화면이 사용     |
| 답변 방식·난이도 라벨    | 상수          | 01·06·07이 같은 라벨을 사용                           |
| 시작 전 안내 불릿        | 인라인        | AI-07 한 곳에서만 쓰는 고정 문구                      |
| 문항 수 5 · 예상 10분    | 인라인        | AI-07 표시 전용 문구. 서버가 문항 수를 정한다         |

## 2. 영향 분석

| 구분 | 파일                                                                                                           |
| ---- | -------------------------------------------------------------------------------------------------------------- |
| 신규 | `entities/interview/{index.ts, api/use-cs-topics.ts, api/use-interview-stacks.ts, model/interview-options.ts}` |
| 신규 | `features/interview-session-setup/model/{session-setup-store.ts, session-setup-rules.ts, use-*.ts, *.test.ts}` |
| 신규 | `features/interview-session-setup/api/use-create-interview-session.ts`                                         |
| 신규 | `features/interview-session-setup/ui/` 단계 7종 + 프레임·카드·폴백 + `session-setup.test.tsx`                  |
| 신규 | `pages/interview-setup/` · `pages/interview/` (AI면접 홈 자리, Q2 판정)                                        |
| 신규 | `app/routes/_authenticated/_focus/interview.new.$step.tsx` · `_app-shell/interview.index.tsx`                  |
| 수정 | `shared/config/nav-items.ts` · `widgets/header/ui/header{,.test}.tsx` (GNB 「AI면접」, Q2 판정)                |
| 수정 | `app/routeTree.gen.ts` (재생성)                                                                                |

추가 영향: `shared/ui/checkbox/checkbox.tsx`·`shared/ui/chip/chip.tsx`, 선택 카드 이미지, `shared/lib/rewind-history.ts`와 테스트,
세션 목적지 라우트, 직군별 스택 미리 조회. 런타임 의존성 추가는 없다.

## 3. 의존 관계 검증

- 라우트 1개(`$step`)가 단계 ID를 검증해 `InterviewSetupPage step={…}`로 넘긴다. 잘못된 단계는 `notFound()`
- feature는 경로를 모른다. 목적지를 **단계 ID**로 반환하고 page가 경로로 바꾼다 (라우팅 결정은 pages 몫)
- 세션 생성 성공 후 이동은 page가 `onCreated(sessionId)`로 받는다
- 위반 없음

## 4. 구현 계획 체크리스트

- [x] `[entities]` 조회 어댑터·표시 문구·스택 미리 조회
- [x] `[features]` rules·store·mutation과 단위·MSW 테스트
- [x] `[features]` 단계 UI 7종 — native radio·checkbox, 재클릭 해제·키보드 선택·로딩·재시도
- [x] `[pages]` 단계 → 경로, 생성 후 설정 진입 기록까지 돌아가 목적지로 교체
- [x] `[app]` 진입 검사·설정 이탈 초기화·라우트 추가와 트리 재생성
- [x] lint·타입·전체 테스트·빌드·변경 소스 포맷·generated 직접 참조 검사
- [ ] AC-3 선택 카운터 복원 또는 요구사항 제외 결정
- [ ] 브라우저 시안 대조·실서버 생성·실제 뒤로가기 확인

## 5. 리스크

| 리스크                               | 영향                              | 대응                                               |
| ------------------------------------ | --------------------------------- | -------------------------------------------------- |
| 조회 API 응답 schema 부재            | 응답 형태 변경을 타입이 못 잡음   | 어댑터 한 곳에서만 좁힌다. 백엔드 schema 추가 요청 |
| AI-00·AI-08 본문 미구현              | 홈은 시작 링크만, 생성 후 빈 화면 | 진입과 목적지 라우트만 연결. 본문은 별도 작업      |
| 메모리 store라 새로고침 시 초안 소실 | 중간 단계 진입 시 빈 상태         | 진입 가드로 AI-01 복귀 (Q10)                       |

## 6. 완료 후 액션

- [ ] 미완료 AC·수동 검증·명세 승격 후 `done`으로 이동
- [x] `docs/implementation-status.md`에 반응형 구현·자동 검사 통과·미완료 검증 반영
- [ ] 확정 명세를 `docs/fe-implement-spec/WEB-AI-01~07/`로 승격
- [ ] 백엔드 응답 schema 후속 요청 정리(요청 전송은 하지 않음)

## 7. 코드 커밋 구성

앞선 상태·선택 단계·공용 UI 커밋에 이어 2026-10-11 정리한 순서다.

| 커밋       | 검토 범위                                               |
| ---------- | ------------------------------------------------------- |
| `cd875c39` | 선택 카드·라디오·CS 목록·스켈레톤·프레임·진행 바·이미지 |
| `db0ea7f0` | 확인 화면·문항 수와 예상 시간·선택 내용·시작 안내       |
| `c4264653` | 단계 이동·생성 mutation·성공/실패 테스트                |
| `ab3cbe13` | 진입 가드·설정 이탈·히스토리·빈 세션 목적지             |
| `c06f94af` | 데스크톱 헤더 AI면접 메뉴                               |

후속 `79179849`는 이전·다음 콜백 분리와 이전 버튼의 방문 기록 되돌리기를 묶었다. 작업 문서는 별도 커밋으로 둔다.

검증 근거는 `checklist.md`, 남은 결정은 `spec.md` Q15~Q20에 둔다.
히스토리 처리는 첫 설정 진입 기록을 목적지로 교체하며, 이후 기록 전체를 삭제하는 처리는 아니다.
