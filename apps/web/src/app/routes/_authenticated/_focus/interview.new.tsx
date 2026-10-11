import { Outlet, createFileRoute } from '@tanstack/react-router';

import { leaveSessionSetup, recordSessionSetupEntry } from './-interview-setup-route';

// 단계 사이 이동은 이 부모 안에서 처리한다. 설정 밖으로 나갈 때만 onLeave로 초안을 비운다.
export const Route = createFileRoute('/_authenticated/_focus/interview/new')({
  beforeLoad: recordSessionSetupEntry,
  component: Outlet,
  onLeave: leaveSessionSetup,
});
