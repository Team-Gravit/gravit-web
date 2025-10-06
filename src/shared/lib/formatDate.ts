// API나 UI와 무관한 순수 로직들
export const formatDate = (date: Date) => {
	return date.toLocaleDateString("ko-KR");
};
