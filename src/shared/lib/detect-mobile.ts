/**
 * 모바일 디바이스 감지 유틸리티
 */
export const isMobileDevice = (): boolean => {
	const userAgent =
		navigator.userAgent || navigator.vendor || (window as any).opera;

	const mobilePattern =
		/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

	if (mobilePattern.test(userAgent.toLowerCase())) {
		return true;
	}

	const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
	const isSmallScreen = window.innerWidth <= 768;

	return hasTouch && isSmallScreen;
};
