import { toastEventManager } from "@/shared/lib/toast";
import {
	TOAST_EVENT,
	type ToastMessage,
	type ToastOptions,
	type ToastType,
} from "@/shared/lib/toast/types";

const showToast = (
	message: ToastMessage,
	options: ToastOptions,
	type?: ToastType,
) => {
	return toastEventManager.trigger(TOAST_EVENT.show, message, {
		...options,
		type,
	});
};

const toast = (message: ToastMessage, options: ToastOptions = {}) => {
	return showToast(message, options, "none");
};

toast.error = (message: ToastMessage, options: ToastOptions = {}) =>
	showToast(message, options, "error");
toast.confirm = (message: ToastMessage, options: ToastOptions = {}) =>
	showToast(message, options, "confirm");
toast.none = (message: ToastMessage, options: ToastOptions = {}) =>
	showToast(message, options, "none");

export default toast;
