import type { AxiosRequestConfig } from "axios";
import { privateApiClient } from "./config";

export const customInstance = async <T>(
	url: string,
	options?: RequestInit,
): Promise<T> => {
	const response = await privateApiClient({
		url,
		method: (options?.method as AxiosRequestConfig["method"]) ?? "GET",
		data: options?.body,
		headers: options?.headers as Record<string, string>,
		signal: options?.signal ?? undefined,
	});
	return {
		data: response.data,
		status: response.status,
		headers: response.headers,
	} as unknown as T;
};