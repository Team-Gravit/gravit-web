export type ApiSuccessResponse<T> = T;

export interface ApiErrorResponse {
	error: string;
	message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
