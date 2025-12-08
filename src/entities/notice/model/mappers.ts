import type {
	NoticeDetailResponse,
	SliceResponse,
} from "@/shared/api/@generated";

import type { NoticeItem, NoticeList, NoticeDetail } from "./types";

/** OpenAPI NoticeDetailResponse → 프론트엔드 NoticeDetail */
export function mapToNoticeDetail(raw: NoticeDetailResponse): NoticeDetail {
	return {
		id: raw.id ?? 0,
		title: raw.title,
		content: raw.content,
		authorName: raw.authorName,
		createdAt: raw.createdAt,
		updatedAt: raw.updatedAt,
		status: raw.status,
		pinned: raw.pinned ?? false,
		publishedAt: raw.publishedAt,
	};
}

/** OpenAPI SliceResponse → 프론트엔드 NoticeList */
export function mapToNoticeList(
	raw: SliceResponse,
	page: number,
	totalPages: number,
	contents: NoticeItem[],
): NoticeList {
	return {
		page,
		totalPages,
		hasNext: raw.hasNextPage ?? false,
		contents,
	};
}
