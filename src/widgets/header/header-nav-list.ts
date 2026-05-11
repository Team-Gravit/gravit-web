export const DEFAULT_HEADER_NAV_LIST = [
	{ to: "/main", label: "홈" },
	{ to: "/learning", label: "학습" },
	{ to: "/league", label: "리그" },
	{ to: "/user", label: "마이그래빗" },
];

export const LEARNING_HEADER_NAV_LIST = [
	{ to: "/main", label: "홈" },
	{ to: "/user", label: "마이그래빗" },
	{ to: "/user/notice", label: "공지사항" },
	{ to: "/user/privacy", label: "개인정보 처리방침" },
];

export const getHeaderNavList = (pathname: string) => {
	if (pathname.startsWith("/learning")) {
		return LEARNING_HEADER_NAV_LIST;
	}

	return DEFAULT_HEADER_NAV_LIST;
};
