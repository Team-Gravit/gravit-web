import { useEffect } from "react";
import type { DefaultError, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useInView, type IntersectionOptions } from "react-intersection-observer";

type FetchNextPage<TData, TError> = UseInfiniteQueryResult<
	TData,
	TError
>["fetchNextPage"];

interface UseInfiniteScrollOptions<TData, TError>
	extends Pick<IntersectionOptions, "root" | "rootMargin" | "threshold"> {
	enabled?: boolean;
	hasNextPage?: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: FetchNextPage<TData, TError>;
}

export function useInfiniteScroll<TData = unknown, TError = DefaultError>({
	enabled = true,
	hasNextPage = false,
	isFetchingNextPage,
	fetchNextPage,
	root = null,
	rootMargin = "80px",
	threshold = 0,
}: UseInfiniteScrollOptions<TData, TError>) {
	const { ref, inView } = useInView({
		root,
		rootMargin,
		threshold,
		skip: !enabled,
	});

	useEffect(() => {
		if (!enabled || !inView || !hasNextPage || isFetchingNextPage) return;

		void fetchNextPage();
	}, [enabled, fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

	return ref;
}
