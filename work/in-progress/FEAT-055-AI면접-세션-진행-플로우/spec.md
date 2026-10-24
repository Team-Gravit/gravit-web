---
id: 'FEAT-055'
title: 'AI 면접 시뮬레이션 — 세션 진행 플로우'
type: 'feature'
screen: 'WEB-AI-10 (답변 확인), WEB-AI-질문제시(14370:38007)'
priority: 'medium'
created: '2026-10-10'
revised: '2026-10-10'
---

# FEAT-055 — AI 면접 시뮬레이션 세션 진행 플로우

## 배경 · 목표

AI 면접 시뮬레이션은 **분야·언어·난이도·답변방식을 선택해 세션을 생성하는 플로우(팀원 담당)**와,
**생성된 세션을 문항 단위로 진행하는 플로우(이 작업)**로 나뉜다. 이 작업은 후자다.

사용자는 세션에 진입해 1~N번 문항을 아바타 영상·질문 음성과 함께 받고, **음성 또는 텍스트로**
답한 뒤, 답변 확인 화면에서 검토·수정하고 **일괄 제출**한다. 제출까지가 이 작업의 책임이고,
채점·피드백 화면은 범위 밖이다.

> 이 설계는 구현 전 기술 논의를 고정한 문서다. 미확정 항목(§확인 필요)이 해소되기 전에는
> `ai-plan`으로 넘어가지 않는다.

## 범위

- **진입 전제**: 세션이 이미 생성되어 `sessionId`가 넘어온 상태.
- 문항 제시(아바타 영상 + 질문 음성 + 질문 본문 + 진행률 패널)
- 답변 수집 — **VOICE**(녹음 → S3 업로드 → STT 변환요청) / **TEXT**(직접 입력)
- 문항 전환, 진행 상태 관리
- 답변 확인(검토·수정) 화면
- 최종 일괄 제출 (`POST …/submit`, 5건)

**레이어 배치 (FSD)**

| 조각 | 레이어 |
| ---- | ------ |
| 세션 데이터 조회(문항·음성링크), 진행 상태 store | `entities/interview-session` (`api/` Query, `model/` store) |
| 녹음 시작 버튼, 자동답변 토글, 텍스트 답변 입력, 제출 | `features/interview-*` |
| 진행 화면 조립(영상·음성·질문·패널·footer) | `widgets/interview-session` |
| 순수 진행률 패널, 스위치 등 범용 UI | `shared/ui/progress-panel`, `shared/ui/switch` |

## Out of Scope

- **세션 생성/선택 페이지** (분야·언어·난이도·답변방식 선택 → `POST create`) — 팀원 담당
- 채점 상태 폴링(GRADING), **채점 결과·피드백 대시보드** (`interview-feedback-api`)
- STT 서버 변환 로직 자체 (백엔드)
- `shared/ui/progress-panel` 공통화 작업의 상세 — 별도 항목으로 분리(quiz와 공유)
- i18n (프로젝트 정책상 미도입)

## 용어 정의 (Ubiquitous Language)

| 용어 | 정의 |
| ---- | ---- |
| 세션 진행 플로우 | 세션 진입 ~ 일괄 제출까지. 이 작업의 범위 |
| 진행 store | `entities/interview-session`의 Zustand store. **사용자가 바꾸는 값만** 보관 |
| 답변(answer) | `{ displayOrder, content, audioKey }`. 일괄 제출 단위 |
| 수화(hydrate) | VOICE 모드에서 STT 변환 텍스트를 진행 store의 `content`에 **1회 주입**하는 것 |
| 변환 요청 | 녹음 업로드 후 서버에 STT 시작을 알리는 fire-and-forget 호출 |
| 종료 상태(terminal) | STT 조회 상태 중 `COMPLETED` 또는 `FAILED` (더 기다릴 필요 없음) |

---

## 기술 결정 (ADR)

### ADR-1. 문항·음성 데이터는 store가 아니라 Query(`staleTime: Infinity`)

**Context** — 문항 본문·음성 링크는 세션 생성 직후 1~5번이 한 번에 오고, 세션 중 변하지 않는다.
"한 번 받아 여러 컴포넌트가 공유"라서 store 저장이 떠오른다.

**Decision** — 서버 데이터이므로 **TanStack Query에 `staleTime: Infinity`**로 둔다. 어느 컴포넌트든
`useInterviewQuestions(sessionId)`로 캐시에서 즉시 읽고, 재요청하지 않는다. React 밖(이벤트 핸들러)에서
필요하면 `queryClient.getQueryData`로 꺼낸다.

**Alternatives**

| 안 | 내용 | 거부 이유 |
| --- | --- | --------- |
| 진행 store에 복사 | 조회 응답을 Zustand에 저장 | 진실의 원천이 둘로 갈려 drift. 새로고침 시 어차피 재조회 필요. `state-convention.md` §1의 "서버 데이터 복사" 안티패턴 |
| persist store | store에 넣고 로컬 persist | 직렬화·동기화를 직접 관리해야 함. `sessionId` 재조회가 더 단순 |

**Consequences** — 새로고침 시 Query 캐시가 비면 `sessionId`로 재조회된다(의도된 복구 경로).
단, 진행 store(답변)와 Query(문항)가 **두 소스로 나뉘므로** 컴포넌트가 둘 다 읽어 조합해야 한다.

### ADR-2. 제출용 답변은 진행 store 한 곳에 모으고, STT는 그 store를 1회 수화한다

**Context** — 제출은 마지막에 5건을 보내는 **batch**다. 그래서 모드와 무관하게 5개 답변을
끝까지 클라에 모아야 한다. 그런데 답변 확인 화면에서 편집 대상 텍스트의 출처가 모드마다 다르다
(VOICE=서버 STT, TEXT=사용자 입력)는 점이 복잡함을 유발한다.

**Decision** — **편집 대상 content는 언제나 진행 store의 값**으로 통일한다. textarea는 모드와 무관하게
`store.answers[order].content`에 바인딩한다. 모드별 차이는 "그 칸을 누가 처음 채우냐"뿐이다.

- TEXT: 사용자 입력이 store에 직접 쌓임
- VOICE: STT 결과가 `COMPLETED`되면 store에 **딱 1회 seed(수화)**. 이후엔 사용자가 store 값을 편집

수화는 **문항별 `hydrated` 플래그**로 최초 1회만 수행해, 폴링 재조회가 사용자 수정본을 덮어쓰지 않게 한다.
STT 결과(Query)는 "서버가 인식한 원본", store는 "사용자가 제출할 최종본"으로 의도적으로 분리된다.

**Alternatives**

| 안 | 내용 | 거부 이유 |
| --- | --- | --------- |
| 화면에서 모드 분기 | `if(VOICE) 서버값 else store값` | 편집·제출 경로가 두 갈래로 갈려 중복·버그 표면 증가 |
| STT 결과를 매 렌더 서버에서 읽기 | store 미경유 | 사용자 수정본을 보관할 곳이 없어 batch 제출 불가 |

**Consequences** — `AnswerEditor`가 모드 무지라 두 모드 공유 가능. 대신 "수화는 1회만"이라는
불변식을 플래그로 지켜야 하고, 이를 어기면 수정본이 사라지는 버그가 난다.

### ADR-3. STT 변환 '요청'은 문항 진행 중 백그라운드, '조회'는 제출 시점에 batch 게이트

**Context** — VOICE 모드에서 STT는 비동기(S3 업로드 → 변환요청 → 서버가 변환 → 결과 조회)다.
제출 시점에 5개 변환을 한꺼번에 시작하면 끝에서 오래 기다린다.

**Decision** — 두 타이밍을 분리한다.

- **문항별 "제출" 클릭 시**: presigned 발급 → S3 업로드 → **STT 변환요청(fire-and-forget)** → `audioKey`를
  store에 선기록 → 다음 문항. (결과를 기다리지 않음)
- **마지막 "제출하기" 클릭 시**: 5개 STT 결과를 **batch 조회·폴링** → 전부 **종료 상태(COMPLETED|FAILED)**가
  되면 → `COMPLETED`는 store에 수화, `FAILED`는 빈칸 → 답변 확인 화면 진입.
- **TEXT 모드**: 게이트 없이 바로 답변 확인 화면으로.

게이트는 "모두 COMPLETED"가 아니라 **"모두 종료 상태"**를 조건으로 한다. `FAILED`는 답변 확인 화면에서
직접 입력(= TEXT 편집기 재사용)으로 복구한다.

**Alternatives**

| 안 | 내용 | 거부 이유 |
| --- | --- | --------- |
| 문항별 답변확인(per-step 폴링) | 각 문항마다 변환 완료 대기 후 확인 | 녹음 플로우가 중간중간 끊김. 폴링 로직이 플로우 전체에 분산 |
| 제출 시 변환 시작 | 끝에서 요청+조회 모두 | 끝 대기 시간이 길어짐(5건 직렬/병렬 변환 체감) |
| 게이트 "모두 COMPLETED" | 완료만 통과 | 1건 FAILED면 영원히 진입 불가 |

**Consequences** — 사용자가 2~5번 답하는 동안 앞 문항 변환이 백그라운드로 진행돼 끝 대기가 거의 사라진다.
대신 문항 제출 핸들러가 업로드·변환요청 실패를 반드시 처리해야 한다(아래 ADR-4).

### ADR-4. 문항 제출 핸들러는 1~3 성공 시에만 다음으로 넘어가고, audioKey를 선기록한다

**Context** — ADR-3의 문항별 제출 핸들러에서 업로드/변환요청이 실패했는데 다음 문항으로 넘어가면,
그 문항은 끝 게이트에서 영원히 미완(PENDING/누락)으로 남는다.

**Decision** — 핸들러 순서를 고정한다: ① presigned 발급 → ② S3 PUT → ③ STT 변환요청 → ④ `audioKey`
store 선기록 → ⑤ `goNext()`. **①~③ 중 하나라도 실패하면 goNext 하지 않고 재시도 UI**를 노출한다.
`audioKey`는 이 시점에만 알 수 있으므로 ④에서 반드시 기록한다(content는 끝에서 채움). 연타 방지를 위해
핸들러 진행 중 버튼을 비활성화한다.

**Consequences** — 실패가 다음 문항으로 전파되지 않아 끝 게이트가 안정된다. 핸들러에 네트워크 실패
처리·중복 가드가 추가돼 로직이 늘지만, 디버깅 지옥(끝에서 "왜 PENDING에서 안 끝나지")을 예방한다.

### ADR-5. 공유 세션 상태는 아래 레이어 store에 두고 feature는 selector로 읽는다

**Context** — 자동답변 토글(feature)과 녹음 버튼(feature)이 같은 상태를 공유해야 하는데, **feature끼리
import가 금지**(FSD cross-slice)다. 또 자동답변 값은 footer 밖(`audio.onended` 핸들러)에서도 읽어야 해서
props drilling으로 풀리지 않는다.

**Decision** — `isAutoAnswer`·`currentIndex`·`answers`·`hydratedOrders` 등 **세션 공유 상태는
`entities/interview-session/model` store**에 두고, 각 feature는 **selector로 구독**한다. React 밖 핸들러는
`getState()`로 읽는다. 단순 토글이 아니라 전이가 묶이는 동작은 store 액션으로 노출한다.

- 답변 feature를 `voice`/`text` 둘로 쪼개면(둘 다 store 필요) store는 **entities**에 둬야 함(A안).
- 로직 규모가 작으면 모드 분기하는 **단일 feature 슬라이스**로 합쳐 형제 문제를 없앨 수도 있음(B안).
  → 로직 규모 확정 후 A/B 결정 (§확인 필요).

**Alternatives**

| 안 | 내용 | 거부 이유 |
| --- | --- | --------- |
| footer로 상태 끌어올리기 + props | useState를 footer에 두고 하위에 전달 | `onended` 등 footer 밖 소비처에 전달 불가. feature 간 공유 불가 |
| feature store | 답변 feature 중 하나에 store | 다른 feature가 import하면 cross-slice 위반 |

**Consequences** — feature 격리를 지키며 공유 가능. store가 entities에 생겨 답변 feature가 아래로
의존하는 정방향 구조가 된다. 단, 서버 데이터(문항·음성)는 이 store에 넣지 않는다(ADR-1).

### ADR-6. 미디어·질문 렌더는 widget의 표현/조립이다(feature 아님)

**Context** — 아바타 영상 자동재생·루프, 문항 전환 시 질문 음성 자동재생을 "동작이 있으니 feature"로
오해하기 쉽다.

**Decision** — **자동재생은 사용자 행동이 아니라 상태(`currentIndex`) 변화에 반응하는 표현**이다.
영상·오디오 element는 **순수 표현 컴포넌트**(props로 src 수신), "언제 트느냐"는 **widget**이 세션 상태를
보고 `useEffect`로 구동한다. 질문 본문 표시는 `entities/interview-session/ui`(표시 전용).

**미디어 재생 제약**

- 영상: 무음 아바타 루프 → `autoPlay muted loop playsInline`로 제스처 없이 재생.
- 질문 음성(소리 있음): 자동재생에 **사용자 제스처 필요** → "시작" 탭에서 첫 `play()`로 해금, 이후 문항
  전환은 같은 `<audio>` element의 `src`만 교체해 재생.
- VOICE 녹음: **마이크 스트림은 "시작" 제스처에서 1회 확보**해 들고 있다가, `onended` 시 자동답변이 켜져
  있으면 `MediaRecorder.start()`. 정지는 **1분 30초 타이머**(상수 `MAX_RECORDING_MS`)로 자동, 수동 정지와
  언마운트 모두 단일 `stopRecording()`을 거쳐 `clearTimeout` + `state==='recording'` 가드.
- WebView(네이티브 셸): iOS `playsInline` + `allowsInlineMediaPlayback`, 자동재생·마이크 권한은
  `mediaPlaybackRequiresUserAction={false}` 및 OS 권한 설정 필요 → **`NAT-` 협업 사항**.

**Consequences** — 미디어 컴포넌트가 도메인 무지라 재사용·테스트가 쉽고 재생 타이밍 로직이 widget 한 곳에
모인다. 단, 소리/마이크 때문에 "시작" 제스처에 해금·권한 확보를 묶는 설계가 강제된다.

---

## 확인 필요

기획·Figma·라우트·API 계약이 어긋나 **임의 결정 금지**인 항목.

1. **STT 관련 엔드포인트 부재** — 현재 생성된 클라이언트에는 `audio-uploads`(presigned 발급,
   `{ audioKey, uploadUrl, expiresAt }`)만 있다. **STT 변환 요청**과 **문항별 STT 상태·텍스트 조회**
   엔드포인트가 명세에 없다. ADR-2·3 전체가 이 두 API에 의존한다. 명세 추가 여부·형태 확인 후 orval 재생성 필요.
2. **STT 조회 단건 vs batch** — 제출 시 5개를 한 번에 받는 batch(`[{ displayOrder, status, text }]`)가
   이상적. 단건만 있으면 `useQueries`로 묶어 폴링. 어느 쪽인지 확정 필요.
3. **문항 수 5 vs 10** — API는 5문항에 하드코딩(`questions` 5문항, `submit` `@minItems/@maxItems 5`,
   `displayOrder 1~5`, create "5문항 모두"). 그러나 시안은 진행률 "2/10" + 번호 버튼 10개. 진행률 패널
   번호 개수가 여기 달림. 설계 변경(10 지원)인지 시안이 구버전인지 판정 필요.
4. **세션 store 계약·경계 (팀원 ↔ 이 작업)** — 선택 플로우 store와 진행 store는 분리한다(수명·소유자·레이어
   상이). 경계로 넘어오는 값은 **`sessionId` 하나**를 기본으로 하되(문항은 이쪽에서 Query 조회), 팀원과
   최종 합의 필요. 새로고침·재진입 복구 책임도 함께 확정.
5. **답변 feature 분리(A) vs 단일 슬라이스(B)** — ADR-5. VOICE/TEXT 로직 규모 확정 후 결정.
6. **자동 정지(90초)와 수동 정지의 다음 동작 동일 여부** — 동일하면 분기 없음, 다르면(예: 자동 정지 시
   바로 다음 문항) 그 지점만 분기.

---

## 확정 명세 · 검증 기준

> §확인 필요가 해소되고 사용자가 판정한 뒤 작성한다. 현재 미확정이라 비워 둔다.

- (미작성 — 확인 필요 해소 후 `ai-plan` 단계에서 AC 작성)

---

## Changelog

| 날짜 | 요약 | 사유 | 연관 항목 |
| ---- | ---- | ---- | --------- |
| 2026-10-10 | 세션 진행 플로우 설계 논의 고정(ADR 6건·확인필요 6건) | 구현 전 기술 결정·미확정 항목 기록 | FEAT-055 |
