# 라우트 기준표

**`apps/web`의 현재 URL 기준표.** 외부 계약은 확정 경로이고, 내부 화면 경로는 각 화면을 이전·신설할 때
정보 구조와 함께 다시 평가한다. legacy URL은 그대로 유지해야 하는 근거가 아니다.

> 2026-09-11 MIG-025에서 메인 화면의 타입 안전한 이동을 위해 현재 경로를 정리했다. 네이티브 셸은
> 루트 URL만 열고(`apps/native/app/index.tsx`), 서버 응답에 URL 필드가 없으며(`v3/api-docs` 전수 확인),
> 푸시 딥링크가 없다. 아래 「외부 계약」만 고정이다. `/learning/$chapterId/$unitId`의 평탄화 여부를
> 포함한 내부 URL은 해당 화면의 `MIG-`에서 사용 흐름과 정보 구조를 검토한 뒤 확정한다.

## 1. 외부 계약 — 바꾸지 않는다

| 경로                           | 이유                                      |
| ------------------------------ | ----------------------------------------- |
| `/`                            | 로그인. 세션이 있으면 `/main`으로 보낸다  |
| `/login/oauth2/code/$provider` | 서버에 등록된 OAuth redirect_uri          |
| `/terms` · `/privacy`          | 공개 문서. 스토어·외부에서 링크될 수 있다 |
| `/restore`                     | 계정 복구 진입점                          |

## 2. 인증 화면 (`_authenticated` 아래)

| 화면 ID             | 경로                                                         | legacy                                                      | 상태                             |
| ------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------- |
| `MAIN-01`           | `/main`                                                      | 같음 (`/mains`는 폐기)                                      | MIG-025                          |
| `ONB-01` · `ONB-02` | `/onboarding` · `/onboarding/success`                        | `/onboarding` · `/success`                                  | ✅ MIG-024                       |
| `LRN-01`            | `/learning`                                                  | 같음                                                        | 학습 화면 MIG에서 재검토         |
| `LRN-02`            | `/learning/$chapterId`                                       | 같음                                                        | 학습 화면 MIG에서 재검토         |
| `LRN-03`            | `/learning/$chapterId/$unitId`                               | 같음                                                        | 학습 화면 MIG에서 재검토         |
| `LRN-04`            | `/learning/$chapterId/$unitId/concept-note`                  | 같음                                                        | 학습 화면 MIG에서 재검토         |
| `QUIZ-01`~`08`      | `/learning/$chapterId/$unitId/lessons/$lessonId`             | `…/$unitId/$lessonId` — id 3연속을 피한다                   | 학습 화면 MIG에서 재검토         |
| 오답 노트           | `/learning/$chapterId/$unitId/wrong-answers`                 | `…/incorrect-problems` — API `wrong-answered-notes` 와 맞춤 | 학습 화면 MIG에서 재검토         |
| 북마크              | `/learning/$chapterId/$unitId/bookmarks`                     | `…/bookmarked-problems` — API `bookmarks` 와 맞춤           | 학습 화면 MIG에서 재검토         |
| `LG-01`~`03`        | `/league`                                                    | 같음                                                        |                                  |
| `MY-01`             | `/my`                                                        | 같음. `/user`는 폐기                                        |                                  |
| `MY-02`·`03`        | `/my/summary` · `/my/learning` · `/my/league` · `/my/social` | 같음                                                        |                                  |
| `MY-04` 팔로우      | `/my?follow=followers` \| `following` (모달)                 | `/my/follow` — 화면 이전 때 확정                            | 확인 필요                        |
| 친구 검색           | `/my/friends/search`                                         | `/user/addfriend`                                           |                                  |
| `MY-05` 프로필 수정 | `/my/edit`                                                   | 같음. `/user/edit`는 폐기                                   |                                  |
| `NOTI-01` 알림      | `/notifications`                                             | 없음 (신설)                                                 |                                  |
| 공지사항            | `/notices?page=N` · `/notices/$noticeId`                     | `/user/notice/$page/$noticeId` — 페이지는 query             | Figma 그룹 없음 — 존치 확인 필요 |
| `SETTING-01`        | `/settings`                                                  | 같음                                                        |                                  |
| 개인정보 설정       | `/settings/privacy`                                          | `/user/privacy`                                             |                                  |
| `SUPPORT-01`·`02`   | `/settings/inquiry` · `/settings/inquiry/new`                | 같음                                                        |                                  |
| `WDR-01`·`02` 탈퇴  | `/settings/withdraw`                                         | `/user/me/delete/page`                                      |                                  |
| AI면접              | `/interview`                                                 | 없음 (신설). 헤더 네비 5번째                                |                                  |
| `ERR-02` 404        | 루트 `notFoundComponent`                                     | `_authenticated/$`                                          | ✅                               |
| `ERR-01` 401        | 라우트 없음 — 게이트가 `/`로 보낸다                          | —                                                           | MIG-005                          |

## 3. 규칙

- **리소스 이름 없이 동적 세그먼트를 연달아 두지 않는다.** `/a/$x/$y/$z`는 URL만 보고 무엇인지 알 수 없다
- **페이지 번호·탭·필터는 query**다. 경로 세그먼트가 아니다 (`state-convention` §1)
- 이름은 API 리소스 이름과 맞춘다 (`bookmarks` · `wrong-answers` · `notices` · `notifications`)
- 파일 경로가 그대로 URL이 되게 두지 않는다 (`/user/me/delete/page` 사례)
- 목적지 화면이 아직 없으면 `app/routes/`에 `component: () => null` 자리 라우트를 둔다 (타입 라우트 유지). 화면 이전 시 채운다
- 하위 경로가 있는 화면(`/learning/…`, `/my/…`)은 `learning.index.tsx`처럼 **index 라우트**로 둔다. 평면 `learning.tsx`는 레이아웃이 되어 하위 라우트가 그 컴포넌트 안에 갇힌다

## 4. 폐기

`/mains` · `/user` · `/user/edit` · `/user/privacy` · `/user/addfriend` · `/user/notice/*` · `/user/me/delete/page` ·
`/success` · `/_authenticated/test`. 새 앱에 만들지 않는다. legacy 폐기 조건은 `migration-status.md`.
