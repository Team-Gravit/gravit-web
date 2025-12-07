export type ToastPosition = "bottom" | "top";

export type ToastOptions = {
	showingTime?: number;
	isAutoClosed?: boolean;
	isCloseOnClick?: boolean;
	position?: ToastPosition;
	bottom?: string;
	top?: string;
};

export type ToastMessage = string;

export type ToastArgs = {
	message: ToastMessage;
	options: ToastOptions;
};

export type ToastType = "error" | "confirm" | "none";

export type ToastOptionProps = ToastOptions & {
	type?: ToastType;
	onClose?: () => void;
	onUndo?: () => void;
};

export type ToastRequiredProps = {
	message: ToastMessage;
};

export type ToastProps = React.ComponentProps<"div"> &
	ToastOptionProps &
	ToastRequiredProps;

const TOAST_SHOW = "TOAST_SHOW" as const;
const TOAST_CLOSE = "TOAST_CLOSE" as const;

export const TOAST_EVENT = {
	show: TOAST_SHOW,
	close: TOAST_CLOSE,
};

export type ToastEventType = typeof TOAST_SHOW | typeof TOAST_CLOSE;

export type ToastEventCallbackMap = {
	[TOAST_SHOW]: (message: ToastMessage, options: ToastOptions) => void;
	[TOAST_CLOSE]: () => void;
};

export type AddEventHandlerArgs<K extends keyof ToastEventCallbackMap> = {
	eventType: K;
	callback: ToastEventCallbackMap[K];
};
