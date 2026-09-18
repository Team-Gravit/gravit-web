import { Outlet, createFileRoute } from '@tanstack/react-router';

// 문제 풀이 화면에서는 헤더와 하단 탭을 숨겨 다른 메뉴로 이탈하지 못하게 한다.
// 새 풀이 라우트도 앱 셸이 아닌 이 전체화면 그룹 아래에 둔다.
export const Route = createFileRoute('/_authenticated/_focus')({
  component: Outlet,
});
