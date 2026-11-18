# 성능 측정 기록 — {YYYY-MM-DD} {before | after: 무엇을 고친 뒤}

> 이 파일을 `records/{날짜}-{설명}.md`로 복사해서 쓴다. 측정 방법은 `README.md`.
> ★부터 채운다. 전부 채우려고 하지 않는다.

## 1. 측정 조건

**개선 전후는 이 표가 같아야 비교할 수 있다.**

| 항목 | 값 |
| --- | --- |
| 날짜 | |
| 브랜치 / 커밋 | (`git log -1 --oneline`) |
| 실행 방식 | `build` + `preview` (localhost:5173) |
| API | 실제 dev 서버 / MSW (`VITE_ENABLE_API_MOCKING=`) |
| 기기 | PC Chrome (버전: ) / 실기기: |
| 뷰포트 | 모바일: Device toolbar (기기: ) / 데스크톱: 창 너비 px |
| CPU | 4x slowdown |
| Network | 로딩 Fast 4G / INP No throttling |
| 반복 | 3번 측정, 가운데 값 |
| 측정자 | |

> **뷰포트를 꼭 정한다.** 이 앱은 768px(`md`)을 기준으로 화면 구성이 바뀐다. 리그 배경은 모바일 66KB / 데스크톱 1.9MB를
> 따로 받고, 메인·개념 노트는 좁은 화면과 넓은 화면 레이아웃이 따로 있다. 앱(WebView) 사용자가 기준이므로
> **모바일을 먼저** 재고, 레이아웃이 갈리는 화면만 데스크톱을 추가로 잰다.

## 2. 라우트별 로딩 (LCP · CLS)

주소창 직접 진입 → Performance **↻ Record and reload** → 아무것도 누르지 않는다.
첫 방문 = Disable cache 켬 / 재방문 = 끔. 뷰포트 열에 **M**(모바일) 또는 **D**(데스크톱).

| ★ | 라우트 | 뷰포트 | 사용한 ID | 첫 방문 LCP | 재방문 LCP | LCP 요소 | CLS | 전송량 | 요청 수 | 증거 | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ★ | `/main` 홈 | M | — | | | | | | | | 로그인 후 첫 화면 |
| | `/main` 홈 | D | — | | | | | | | | 넓은 화면 레이아웃이 따로 있음 |
| ★ | `/learning` 학습 홈 | M | — | | | | | | | | |
| | `/learning/chapters/$chapterId` | M | | | | | | | | | |
| | `/learning/units/$unitId` | M | | | | | | | | | |
| ★ | `/learning/units/$unitId/concept-note` | M | | | | | | | | | 마크다운 + 코드 하이라이트 |
| | `/learning/units/$unitId/concept-note` | D | | | | | | | | | 넓은 화면 레이아웃이 따로 있음 |
| ★ | `/learning/lessons/$lessonId` 퀴즈 | M | | | | | | | | | 로딩 화면 최소 노출 시간 있음 (아래 참고) |
| | `/learning/units/$unitId/incorrect-problems` | M | | | | | | | | | 오답 풀이 |
| | `/learning/units/$unitId/bookmarked-problems` | M | | | | | | | | | 북마크 풀이 |
| | `/league` | M | — | | | | | | | | 배경 66KB |
| ★ | `/league` | D | — | | | | | | | | **배경 1.9MB** |
| | `/my/summary` | M | — | | | | | | | | `/my`는 여기로 보낸다 |
| | `/my/learning` · `/my/league` · `/my/social` | M | — | | | | | | | | |
| | `/friends` | M | — | | | | | | | | **모바일 전용.** 데스크톱은 `/my/social`로 보낸다 |
| | `/notifications` | M | — | | | | | | | | 데스크톱은 헤더 팝오버 |
| | `/settings` | M | — | | | | | | | | |
| | `/settings/inquiry` · `/settings/inquiry/new` | M | — | | | | | | | | |
| | `/` 로그인 | M | — | | | | | | | | **로그아웃 상태로.** 로그인 상태면 `/main`으로 보낸다 |

### 주소 직접 진입으로 LCP를 잴 수 없는 화면

| 라우트 | 이유 | 대신 이렇게 |
| --- | --- | --- |
| `/learning/lessons/$lessonId/result/$submissionId` | 제출 직후 이동만 허용. 직접 들어오면 `/learning`으로 보낸다 | 마지막 문제 제출 직전에 **● Record** → 결과 화면이 뜰 때까지 기록. 전송량·요청 수만 적는다 |
| `/onboarding` · `/onboarding/success` | 온보딩을 마친 계정은 `/main`으로 보낸다 | 새 계정이 필요하다. 처음엔 건너뛴다 |
| `/interview/new/*` | 선택 초안이 메모리에만 있어 새로고침하면 첫 단계로 돌아간다. **`feat/#270/interview` 브랜치에만 있다** | 그 브랜치를 빌드한 뒤 `/interview/new/answer-type`만 직접 진입으로 잰다. 스택 단계는 앱 안에서 이동해 **● Record**로 전송량만 적는다 (아이콘 약 7.7MB) |

### 측정하지 않는 라우트

빈 자리 라우트(`component: () => null`)는 화면이 없다: `/settings/notice` · `/my/friends/search` · `/restore` ·
`/interview/sessions/$sessionId`. `/terms` · `/privacy`는 정적 문서라 우선순위가 낮다.

> **퀴즈 LCP 주의**: 퀴즈 · 오답 · 북마크 풀이는 진입할 때 로딩 화면을 최소 시간 동안 보여준다 (`use-initial-minimum-duration`).
> LCP가 로딩 화면 이미지로 잡힐 수 있다. "LCP 요소" 칸에 무엇이 잡혔는지 꼭 적는다.

## 3. 액션별 반응 (INP)

시크릿 창 · Network **No throttling** → **새로고침** → 다 뜨면 **● Record** → 그 동작만 **한 번** → Interactions 막대.
**동작마다 새로고침하고 첫 클릭 값을 적는다** (첫 실행은 컴파일 비용 때문에 느리고, 그게 실제 사용자 경험이다).

> **INP는 클릭 · 탭 · 키 입력만 잰다. 스크롤은 INP에 들어가지 않는다.** 스크롤이 버벅이는 건
> Performance 패널의 Frames 줄(끊긴 프레임)로 따로 본다.

| ★ | 화면 | 뷰포트 | 액션 | INP | 가장 긴 구간 | 원인 메모 | 증거 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ★ | 퀴즈 | M | 객관식 보기 선택 (바로 채점 표시) | | | | |
| ★ | 퀴즈 | M | 주관식 답 입력 (한 글자) | | | 글자마다 무엇이 다시 그려지는지 | |
| | 퀴즈 | M | 주관식 답 제출 | | | | |
| ★ | 퀴즈 | M | 다음 문제 | | | | |
| | 퀴즈 | D | 진행 패널에서 문제 번호 클릭 | | | | |
| | 퀴즈 | M | 북마크 토글 | | | | |
| | 퀴즈 | M | 마지막 문제 끝내기 (제출 덮개가 뜰 때까지) | | | | |
| | 오답 풀이 | M | 오답에서 제외 | | | | |
| | 퀴즈 | M | 상단 닫기 버튼 | | | | |
| | 유닛 상세 | M | 레슨 진입 / 잠긴 레슨 클릭 (토스트) | | | | |
| | 학습 홈 · 챕터 | M | 카드 클릭 | | | | |
| ★ | 리그 | M | 티어 선택 | | | 순위 목록이 다시 그려진다 | |
| | 마이 | M | 탭 전환 | | | | |
| | 마이 소셜 | M | 팔로우 / 언팔로우 | | | | |
| | 마이 소셜 | M | 추천 친구 팔로우 · 친구 소식 축하 | | | | |
| | 마이 소셜 | D | 팔로워 · 팔로잉 모달 열기 | | | | |
| | 친구 | M | 팔로워 ↔ 팔로잉 탭 전환 | | | | |
| | 헤더 | D | 알림 팝오버 열기 | | | | |
| | 바텀탭 · 헤더 | M · D | 메뉴 이동 | | | | |
| | 문의 작성 | M | 유형 선택 / 본문 입력 (한 글자) | | | | |
| | 온보딩 | M | 닉네임 입력 (한 글자) | | | 중복 확인은 입력이 멈춘 뒤 요청 | |
| | 면접 설정 | M | 카드 선택 / 다음 | | | `feat/#270/interview` 브랜치에서만 | |

가장 긴 구간: **Input delay** / **Processing** / **Presentation** 중 하나.

## 4. Lighthouse (★만, 한 번씩)

Navigation / Mobile / Performance만 / **Clear storage 해제**. 데스크톱 행은 Device를 Desktop으로 바꾼다.

| 라우트 | Device | 점수 | LCP | CLS | TBT | 주요 진단 (상위 3개) | 리포트 파일 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/main` | Mobile | | | | | | |
| `/learning` | Mobile | | | | | | |
| `.../concept-note` | Mobile | | | | | | |
| `/learning/lessons/$lessonId` | Mobile | | | | | | |
| `/league` | Desktop | | | | | | |

## 5. 실기기 (나중에, ★만)

| 라우트 / 액션 | 기기 | LCP | INP | 비고 |
| --- | --- | --- | --- | --- |
| | | | | |

## 6. 다음 할 일

숫자만 적고 끝내지 않는다. 원인이 보이면 바로 과제로 옮긴다.

| 우선 | 과제 | 근거 (표의 어느 칸) | 기대 효과 | 상태 |
| --- | --- | --- | --- | --- |
| | | | | |

## 7. 전후 비교 (after 기록일 때)

| 대상 | before | after | 변화 | 증거 (before / after) |
| --- | --- | --- | --- | --- |
| | | | | |
