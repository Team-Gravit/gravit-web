// 라우트는 단계 검증과 초안 진입·이탈 API만 사용한다. store는 슬라이스 내부에서 관리한다.
export {
  isSessionSetupStep,
  SESSION_SETUP_STEPS,
  type SessionSetupStep,
} from './model/session-setup-rules';
export { canEnterSessionSetupStep, resetSessionSetup } from './model/session-setup-store';
// 페이지는 단계와 이동 콜백을 넘겨 설정 화면을 조립한다.
export { SessionSetup, type SessionSetupProps } from './ui/session-setup';
