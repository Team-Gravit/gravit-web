---
id: 'FIX-052'
planned: '2026-10-08'
mode: 'fix'
---

# FIX-052 구현 계획

> 사용자가 직접 구현하며 학습한다. 단계마다 무엇을 확인할지 적는다.

## 체크리스트

- [ ] **1. 원인 확인** — dev 서버에서 재현(AC-1). 개발자 도구에서 `document.querySelector('.overflow-y-auto').scrollTop` 이 이동 뒤에도 남는지 본다
- [x] **2. `app/router/router.ts`**
  ```ts
  scrollRestoration: true,
  scrollToTopSelectors: [
    '[data-scroll-restoration-id="app-shell"]',
    '[data-scroll-restoration-id="settings"]',
  ],
  ```
  확인: `sessionStorage` 에 `tsr-scroll-restoration-v1_3` 키가 생긴다
- [x] **3. 스크롤 상자 이름** — `_app-shell/route.tsx` 에 `data-scroll-restoration-id="app-shell"`, `settings/route.tsx` 에 `"settings"`. 확인: AC-1 · AC-5
- [ ] **4. 기록 이동 복원** — AC-2 · AC-3. `sessionStorage` 값에 `[data-scroll-restoration-id="app-shell"]` 항목이 쌓이는지 본다
- [x] **5. 임시 코드 제거** — `friends-page.tsx` 의 `mainRef` · `useEffect` 제거. 확인: AC-4
- [ ] **6. 확인 필요 1 판정** — 마이페이지 탭에 `resetScroll={false}` 를 줄지
- [ ] **7. 검증** — AC-6 · AC-7, `checklist.md` 작성

## 리스크

| 리스크                                                     | 대응                                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 뒤로가기 때 데이터가 아직 없으면 높이가 모자라 덜 내려간다 | React Query `staleTime` 60초 안에서는 캐시로 바로 그려진다. 어긋나는 화면이 나오면 Out of Scope 항목으로 분리 |
| `window` 초기화는 끌 수 없다                               | 이 앱은 `window` 가 스크롤하지 않아 영향 없음                                                                 |
| 라우터 업그레이드로 저장 키 · 동작이 바뀜                  | 동작 근거를 `spec.md` 에 버전(1.171)과 함께 남겼다                                                            |
