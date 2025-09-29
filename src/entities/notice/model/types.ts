export interface NoticeItem {
	id: number;
	title: string;
	summary: string;
	pinned: boolean;
	publishedAt: string;
}

export interface NoticeList {
	page: number;
	totalPages: number;
	hasNext: boolean;
	contents: NoticeItem[];
}

export interface NoticeDetail {
	id: number;
	title: string;
	content: string;
	authorName: string;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
	status: string;
	pinned: boolean;
}
