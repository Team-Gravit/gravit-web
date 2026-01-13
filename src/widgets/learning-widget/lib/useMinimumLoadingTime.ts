import { useEffect, useRef, useState } from "react";

interface UseMinimumLoadingTimeOptions {
	isLoading: boolean;
	minimumTime?: number; // ms
}

export function useMinimumLoadingTime({
	isLoading,
	minimumTime = 2000,
}: UseMinimumLoadingTimeOptions) {
	const [shouldShowLoading, setShouldShowLoading] = useState(isLoading);
	const loadingStartTimeRef = useRef<number | null>(null);

	useEffect(() => {
		if (isLoading && loadingStartTimeRef.current === null) {
			loadingStartTimeRef.current = Date.now();
			setShouldShowLoading(true);
		}
		if (!isLoading && loadingStartTimeRef.current !== null) {
			const elapsedTime = Date.now() - loadingStartTimeRef.current;
			const remainingTime = Math.max(0, minimumTime - elapsedTime);

			if (remainingTime > 0) {
				const timer = setTimeout(() => {
					setShouldShowLoading(false);
					loadingStartTimeRef.current = null;
				}, remainingTime);

				return () => clearTimeout(timer);
			} else {
				setShouldShowLoading(false);
				loadingStartTimeRef.current = null;
			}
		}
	}, [isLoading, minimumTime]);

	return shouldShowLoading;
}
