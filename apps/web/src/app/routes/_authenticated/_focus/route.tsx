import { Outlet, createFileRoute } from '@tanstack/react-router';

/**
 * 헤더와 하단 탭이 없는 전체화면 그룹.
 *
 * 문제를 푸는 화면은 풀이 도중 다른 메뉴로 빠져나가면 진행 중이던 답안이 사라진다. 화면마다
 * 셸을 숨기는 대신 레이아웃 라우트 위치로 강제한다 (`fsd-pages.md` §6-1).
 */
export const Route = createFileRoute('/_authenticated/_focus')({
  component: Outlet,
});
