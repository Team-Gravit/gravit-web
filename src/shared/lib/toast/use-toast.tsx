import { useCallback, useEffect, useState } from "react";
import { toastEventManager } from "./event-manager";
import {
	TOAST_EVENT,
	type ToastArgs,
	type ToastMessage,
	type ToastOptions,
} from "./types";

const DEFAULT_TIME = 3000;

export const useToast = () => {
	const [currentToast, setCurrentToast] = useState<ToastArgs | null>(null);

	const showToast = useCallback(
		(message: ToastMessage, options: ToastOptions) => {
			setCurrentToast({ message, options });
		},
		[],
	);

	const closeToast = () => {
		setCurrentToast(null);
	};

	const setAutoCloseTimer = useCallback(() => {
		if (!currentToast) return;

		const showingTime = currentToast.options.showingTime || DEFAULT_TIME;
		const timer = setTimeout(() => setCurrentToast(null), showingTime);

		return () => clearTimeout(timer);
	}, [currentToast]);

	useEffect(() => {
		if (currentToast?.options.isAutoClosed) setAutoCloseTimer();

		return;
	}, [currentToast, setAutoCloseTimer]);

	useEffect(() => {
		toastEventManager.addEventHandler({
			eventType: TOAST_EVENT.show,
			callback: showToast,
		});
	}, [showToast]);

	return {
		currentToast,
		closeToast,
	};
};
