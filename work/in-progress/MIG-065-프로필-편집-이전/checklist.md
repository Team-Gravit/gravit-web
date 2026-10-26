---
id: 'MIG-065'
validated: '2026-10-25'
mode: 'migrate'
---

# MIG-065 검증 결과

## 1. 자동 검증

| #   | 검사            | 명령                                         | 결과 |
| --- | --------------- | -------------------------------------------- | ---- |
| 1   | 린트 + FSD 경계 | `pnpm --filter @repo/web lint`               | ✅   |
| 2   | 타입            | `pnpm --filter @repo/web check-types`        | ✅   |
| 3   | 테스트(변경분)  | `vitest run` (관련 4파일 21 tests)           | ✅   |
| 4   | 빌드            | `pnpm --filter @repo/web build`              | ✅   |
| 5   | 포맷            | `pnpm format:check` (전체)                   | ✅   |
| 6   | generated 경계  | 생성 키는 feature `api/`·entities에서만 참조 | ✅   |

- CI `Verify` 워크플로가 `pnpm verify`(format:check→lint→check-types→test→build)를 PR에서 돌린다.
  (CLAUDE.md·git-workflow.md의 "PR 자동검사/묶음 스크립트 없음"은 그 사이 CI 추가로 outdated.)
  `format:check`는 현재 레포 전체가 통과한다(REF-003는 해소된 것으로 보임).
- 로컬 전체 `vitest run`에서 `concept-note` 2파일 7건 실패가 있으나, **이번 변경과 무관한 기존 실패**다.
  (MIG-046 진행 중 도메인, `text/markdown` 응답에 대한 MSW/undici 환경 오류 `object.stream is not a function`.
  내가 추가·수정한 파일을 import하지 않는다. CI Node 환경에서의 재현 여부는 CI 결과로 확인한다.)

## 2. 요구사항 ↔ 구현 대조

| #    | AC (spec.md)       | 구현 위치                                                                       | 상태 |
| ---- | ------------------ | ------------------------------------------------------------------------------- | ---- |
| AC-1 | 닉네임 상태 판정   | `entities/user/model/use-nickname-status.ts` (+test 5건)                        | ✅   |
| AC-2 | 제출 가능 판정     | `use-profile-edit-form.ts` `canSubmit` (+test)                                  | ✅   |
| AC-3 | 제출 payload       | `use-profile-edit-form.ts` `submit` (+test: `{nickname, profilePhotoNumber:5}`) | ✅   |
| AC-4 | 성공 후 3키 무효화 | `api/use-update-profile.ts` (banner·mainpage profile·user)                      | ✅   |
| AC-5 | 모바일 돌아가기    | `pages/profile-edit` `goBack` (canGoBack→back / else `/my`)                     | ✅   |

## 3. 이전 검증

| 항목                              | 결과                                                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `plan.md` 2-1 이전 매핑 전량 반영 | ✅ (피커·필드·색상맵은 기존 entities 재사용, 폼·mutation·모달·페이지는 이전+재조립)                                                       |
| 동작 동일성 — 기준선 유지         | ✅ (초기값·순환 선택·디바운스·제출조건·돌아가기·성공 닫기 동일)                                                                           |
| 의도적 변경만 바뀜                | ✅ 승인된 이탈 2건: ①무효화 3키 확장(legacy TODO 해소) ②제출 조건에서 "색 변경 + 무효 닉네임" 버튼 비활성화(legacy는 활성). 테스트로 고정 |
| 남은 legacy 참조 없음             | ✅ (apps/web 내 신규. legacy는 미편집)                                                                                                    |

## 4. 시안 대조 재확인

| #   | 항목                                                      | 반영                                                      |
| --- | --------------------------------------------------------- | --------------------------------------------------------- |
| 1   | 모달 프레임 630 / 헤더 px-6 py-3 / 본문 px-8 pt-8 pb-8    | ✅ (get_metadata 근거)                                    |
| 1-2 | 모달 타이틀 폰트 `body1-normal`·색 `text-4`               | ✅ (타이틀 노드 70777 근거. 리뷰 중 `headline2`에서 교정) |
| 2   | 버튼 gap-4(데스크톱)/gap-3(모바일), 각 flex-1, cta 높이   | ✅                                                        |
| 3   | 피커↔필드 gap 32(데스크톱)/24(모바일) = `gap-6 md:gap-8` | ✅                                                        |
| 4   | 모바일 back-header 「프로필 수정」 h-48                   | ✅ (PageTitleBar)                                         |

### 확인 필요 (시안↔legacy 상충)

- **하단 탭 바**: Figma MY-05-MOB에는 Tab Bar가 포함돼 있으나, legacy `_blank-profile-layout`은
  모바일에서 back-header만 렌더하고 하단 탭을 **표시하지 않는다**. 현재 구현은 legacy를 따라
  전체화면(탭 없음)으로 뒀다. 하단 탭을 유지해야 하면 app-shell 안으로 재배치 필요 → **사용자 판정 대기**.

## 5. 기준 문서 갱신

| 대상                            | 갱신 내용               | 상태              |
| ------------------------------- | ----------------------- | ----------------- |
| `docs/implementation-status.md` | `my/edit` 구현 반영     | ⬜ (done 이동 시) |
| `docs/migration-status.md`      | 프로필 편집 legacy 대체 | ⬜ (done 이동 시) |
| 그 외 `docs/`                   | 해당 없음               | —                 |
