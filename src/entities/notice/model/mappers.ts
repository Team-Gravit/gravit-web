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

/** OpenAPI NoticeDetailResponse → 프론트엔드 NoticeItem */
export function mapToNoticeItem(raw: NoticeDetailResponse): NoticeItem {
	return {
		id: raw.id ?? 0,
		title: raw.title,
		summary: raw.content.slice(0, 100), // summary는 content 일부 발췌
		pinned: raw.pinned ?? false,
		publishedAt: raw.publishedAt,
	};
}

/** OpenAPI SliceResponse → 프론트엔드 NoticeList */
export function mapToNoticeList(
	raw: SliceResponse,
	page: number,
	totalPages: number,
): NoticeList {
	return {
		page,
		totalPages,
		hasNext: raw.hasNextPage ?? false,
		contents: (raw.contents ?? []).map((item: NoticeDetailResponse) =>
			mapToNoticeItem(item),
		),
	};
}
