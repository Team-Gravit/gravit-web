# FEAT-055 구현 계획 — 퍼블리싱 + 뼈대

> 범위: **정적 UI(퍼블리싱) + 레이어·컴포넌트·store 뼈대**까지. 블로커(STT 엔드포인트,
> 문항 수 5 vs 10)에 의존하는 **데이터·로직은 stub 또는 데이터 구동**으로 비워 둔다.
> 상세 설계·ADR·확인필요는 `spec.md` 참조.

## 작업 종류

- **FEAT-055** (신규 기능). 실측 결과 `entities/features/widgets/app`에 interview 구현 **전무**(생성 API만 존재).
- `MIG-`/`REF-`가 아니므로 착수 게이트·기준선은 해당 없음. `feature-planner` 산출물 대신
  `spec.md`의 ADR 6건으로 기술 결정을 고정했다.
- 동작 변경·구조 변경 혼재 아님(순수 신규).

## 사용자 확정 사항 (이 계획에 반영)

1. **진행률 패널 공통화 보류** — `shared/ui`로 추출하지 않고 **interview 전용**으로 둔다.
   상단 진행률 바 유지/삭제 미정 → **바는 일단 유지하되 단일 블록으로 격리**해 나중에 한 줄 삭제로 제거 가능하게 둔다(토글 안 만듦).
2. **구현 순서**: ① 공통 컴포넌트 → ② store → ③ 나머지(features·widget·route). FSD 레이어 순서와 일치시킨다.
3. 블로커는 막지 않으므로 퍼블리싱·뼈대 선진행.

## 영향 분석 (실측)

| 구분 | 파일                                                |
| ---- | --------------------------------------------------- |
| 신규 | 아래 체크리스트 전부 (interview 슬라이스 신규 생성) |
| 수정 | `app/routeTree.gen.ts`(자동 재생성), 라우트 추가분  |
| 삭제 | 없음                                                |

- 기존 interview 코드 참조처: 없음(`rg -l interview` → 생성물뿐). 기존 화면에 대한 파급 없음.
- 생성 훅 실측: mutation은 `useCreate/useIssueUploadUrl/useSubmit/useAbandon` 존재. **GET(`getQuestions`/`getStatus`)은 `useGetX` 훅 미생성 → `getGetQuestionsQueryOptions` + `useQuery`로 래핑.**

---

## 구현 계획 체크리스트 (shared → entities → features → widgets → pages → app)

### ① 공통 컴포넌트 (shared / 표현 전용)

- [ ] `[shared]` `shared/ui/switch/` — 범용 토글 스위치(제어형 `checked`/`onCheckedChange`). cva 변형, `cn()`, 접근성(role/aria-checked, 키보드). Figma 값은 구현 시 `get_design_context`로 대조.
- [ ] `[shared]` 배럴 `shared/ui/switch/index.ts`

> 영상/오디오 플레이어는 interview에서만 쓰므로 shared로 올리지 않고 widget 하위 표현 컴포넌트로 둔다(§③).

### ② store · 데이터 · 도메인 (entities/interview-session)

- [ ] `[entities]` `model/session.ts` — 도메인 타입. `InputType`(VOICE|TEXT), `Answer`(`{ displayOrder; content; audioKey: string|null }`), 생성 모델(`InterviewSessionQuestionResponse` 등) re-export/매핑. `import type`.
- [ ] `[entities]` `model/constants.ts` — `MAX_RECORDING_MS = 90_000`, 진행률/패널 라벨 등 관리 포인트 상수.
- [ ] `[entities]` `model/session-store.ts` — Zustand. state: `currentIndex`, `answers: Record<number, Answer>`, `isAutoAnswer`, `hydratedOrders: Set<number>`. actions: `setAnswer`, `setAudioKey`, `setAutoAnswer`, `markHydrated`, `goTo`, `goNext`, `reset`. **selector 전제로 설계**(전체 구독 금지).
- [ ] `[entities]` `api/use-interview-questions.ts` — `useQuery(getGetQuestionsQueryOptions(sessionId, { query: { staleTime: Infinity, enabled: Boolean(sessionId) } }))` 래핑. queryKey는 생성 팩토리 re-export. **실제 동작(블로커 아님).**
- [ ] `[entities]` `ui/question-card.tsx` — 질문 본문 표시 전용(props로 content·chip 수신, `shared/ui/chip` 사용). 로직 없음.
- [ ] `[entities]` 배럴 `index.ts`

### ③ 나머지 — features

- [ ] `[features]` `interview-text-answer/ui/text-answer-field.tsx` — textarea, `useSessionStore`의 `answers[order].content`에 바인딩(selector + `setAnswer`). **실제 동작.**
- [ ] `[features]` `interview-voice-answer/ui/auto-answer-toggle.tsx` — `shared/ui/switch` + store `isAutoAnswer`/`setAutoAnswer`(selector).
- [ ] `[features]` `interview-voice-answer/ui/record-button.tsx` — "답변 시작하기" 버튼(`shared/ui/button`). 녹음 상태 표시.
- [ ] `[features]` `interview-voice-answer/model/use-recording.ts` — MediaRecorder 뼈대 + 90초 자동정지 타이머. 단일 `stopRecording`(clearTimeout + state 가드), 마이크 스트림 ref. **스켈레톤(권한·WebView는 NAT 협업 전까지 미완 표시).**
- [ ] `[features]` `interview-voice-answer/api/request-stt.ts` — **STUB.** STT 변환요청 엔드포인트 부재(`spec.md` 확인필요 1) → 시그니처만, `ponytail:` 주석으로 "엔드포인트 확정 후 연결".
- [ ] `[features]` `interview-submit/model/to-submit-body.ts` — store `answers` → `InterviewSubmitRequest`(배열) 매핑(순수 함수, 테스트 대상).
- [ ] `[features]` `interview-submit/ui/submit-button.tsx` — 생성 `useSubmit` 연결. **실제 동작**(답변이 다 모였을 때).
- [ ] 각 feature `index.ts` 배럴

### ③ 나머지 — widgets (widgets/interview-session)

- [ ] `[widgets]` `ui/avatar-video.tsx` — 표현 전용. `autoPlay muted loop playsInline`, `pointer-events-none`. src는 props(placeholder 허용).
- [ ] `[widgets]` `ui/question-number-button.tsx` — interview 전용 번호 버튼(상태별 색). **quiz의 것과 중복이나 공통화 보류** → `ponytail:` 주석 + 향후 REF 항목.
- [ ] `[widgets]` `ui/interview-progress-panel.tsx` — 진행률 패널. **상단 진행률 바는 별도 블록으로 격리**(유지/삭제 미정). 번호 그리드는 `questions.length` **데이터 구동**(5 vs 10 충돌에 안 막힘). store `currentIndex`·`answers` 구독, `goTo` 연결.
- [ ] `[widgets]` `ui/session-footer.tsx` — `mode` 받아 조건부 렌더(`VOICE` → voice controls / `TEXT` → text field). 조립만.
- [ ] `[widgets]` `ui/interview-session.tsx` — 전체 조립. 아바타 영상 + 질문 음성(`<audio>` ref) + question-card + progress-panel + footer. "시작" 제스처에서 오디오 해금(+VOICE면 마이크 확보), `currentIndex` 변화 시 음성 재생(useEffect). **미디어 실제 재생은 WebView 설정 전까지 제한적**(표시 명시).
- [ ] `[widgets]` 배럴 `index.ts`

### ③ 나머지 — pages · app

- [ ] `[pages]` `pages/interview-session/ui/interview-session-page.tsx` — 얇게: 라우트 파라미터 `sessionId` 읽어 widget 렌더(+문항 로딩/빈 상태 스켈레톤).
- [ ] `[pages]` 배럴 `index.ts`
- [ ] `[app]` 라우트 추가 — **임시 경로 `/ai-interview/session/$sessionId`** (팀원 네임스페이스 확정 시 조정). 인증 필요하면 `_authenticated` 하위로. 패턴은 `notifications.tsx` 참고.
- [ ] `[app]` **라우트 트리 재생성** — dev/build 시 `routeTree.gen.ts` 자동 갱신(직접 편집 금지).

### 테스트 (뼈대 범위 최소)

- [ ] `to-submit-body` 순수 함수 단위 테스트(빈 답변·audioKey null(TEXT)·5건 매핑).
- [ ] `session-store` 액션 전이 테스트(goNext 경계, setAnswer, markHydrated 1회성).

---

## 리스크

| 리스크                    | 영향                         | 대응                                                                                      |
| ------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| STT 엔드포인트 부재       | VOICE 답변확인·수화 미구현   | request/poll **stub**, 답변확인 화면은 레이아웃만. `spec.md` 확인필요 1 해소 후 별도 진행 |
| 문항 수 5 vs 10           | 번호 그리드 개수             | `questions.length` **데이터 구동**으로 회피(구현 안 막힘)                                 |
| GET 훅 미생성             | 조회 래핑 방식               | `getGetQuestionsQueryOptions` + `useQuery`로 래핑(실측 반영)                              |
| 번호 버튼 quiz 중복       | 일시적 중복 코드             | `ponytail:` 주석 + 향후 REF(패널/버튼 공통화)로 분리                                      |
| 라우트 경로 미확정        | app 라우트·딥링크            | 잠정 경로로 두고 팀원과 조율(확인필요). 트리 재생성 필수                                  |
| 미디어 자동재생·마이크    | 브라우저·WebView 제스처/권한 | "시작" 제스처에 해금·권한 확보 집약. WebView 설정은 `NAT-` 협업(웹 코드 밖)               |
| store 계약(팀원↔이 작업) | 경계 불일치                  | 경계는 `sessionId` 1개 기준(문항은 이쪽 Query). 합의 전까지 타입만 이쪽 정의              |

## 검증 방법 (뼈대 수용 기준)

| 방법        | 내용                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------- |
| 자동 검사   | `pnpm lint` / `check-types` / `test` / `build` 통과(stub 포함 컴파일)                              |
| 라우트 진입 | 잠정 라우트로 진입 시 정적 레이아웃 렌더, VOICE/TEXT footer 분기 확인                              |
| 단위 테스트 | `to-submit-body`·`session-store` 전이                                                              |
| 시안 대조   | 퍼블리싱분은 구현 시 `get_design_context`로 토큰·간격 1:1 대조(별도 `design-diff`에서 판정 목록화) |

> 확정 명세(AC)는 `spec.md` 확인필요 해소 후 작성. 이번 범위는 **뼈대·정적 UI 수용 기준**까지만.

## 승인 후 절차

- `work/to-do/FEAT-055-…` → `work/in-progress/`로 `git mv`
  - ⚠️ 현재 `in-progress/`에 5개(FIX-052·053, MIG-043·046·048) 있음. 작업관리 §3상 1개 권장이나
    기존 진행분이라 임의 이동 안 함 — 사용자 확인 후 처리.
- `ai-orchestrate`로 위 순서대로 구현.
