'use client';

import { mutate } from 'swr';
import { hydrated } from './hydrated';

let id = 0;

export enum ToastType {
	SUCCESS = 0,
	INFO = 1,
	ERROR = 2
}

export interface ToastProps {
	type?: ToastType;
	name?: string;
	message: string;
	duration?: number | false;
}

export interface Toast extends Required<ToastProps> {
	id: number;
	timeout: ReturnType<typeof setTimeout> | false;
}

/**
 * Deletes a toast from the list of toasts.
 * @param toastId The id of the toast to remove
 */
export function deleteToast(toastId: number) {
	mutate('toasts', (toasts: Toast[] = []) => [...toasts.filter(toast => toast.id !== toastId)]);
}

/**
 * Create a toast.
 * @param props Toast to display
 */
export function createToast(props: ToastProps) {
	// If the page is not hydrated, do not create the toast.
	if (!hydrated) return;

	const toastId = id++;
	const duration = props.duration ?? 5_000;
	const type = props.type ?? ToastType.INFO;
	const name = props.name ?? 'Unknown';

	const toast: Toast = {
		...props,
		name,
		id: toastId,
		timeout: !duration ? false : setTimeout(deleteToast, duration + 500, toastId),
		duration,
		type
	};

	mutate('toasts', (toasts: Toast[] = []) => [...toasts, toast]);
	return toastId;
}
