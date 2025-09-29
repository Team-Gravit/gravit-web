export interface Chapter {
	chapterId: number;
	name: string;
	description: string;
	totalUnits: number;
	completedUnits: number;
}

export type ApiSuccessResponse<T> = T;

export interface ApiErrorResponse {
	error: string;
	message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
