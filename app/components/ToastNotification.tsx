'use client';

import { type Toast, ToastType, deleteToast } from '@/util/toasts';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaExclamation, FaInfo } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

export default function ToastNotification({ id, type, name, message, duration }: Toast) {
	const [isVisible, setIsVisible] = useState(false);
	const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({}); // Object to hold the timeouts

	useEffect(() => {
		if (!duration) return;

		requestAnimationFrame(() => {
			setIsVisible(true);
		});

		const fadeOutTimeout = setTimeout(() => {
			setIsVisible(false);
			// Set up a timeout to call deleteToast after the animation completes
			const deleteTimeout = setTimeout(() => {
				deleteToast(id);
			}, 300); // 300ms is the duration of the animation
			// Store the deleteTimeout in the timeoutsRef for cleanup
			timeoutsRef.current[`delete_${id}`] = deleteTimeout;
		}, duration - 300);

		timeoutsRef.current[id.toString()] = fadeOutTimeout; // Store the fadeOutTimeout for cleanup

		return () => {
			// Clear the timeouts when the component is unmounted or dependencies change
			clearTimeout(timeoutsRef.current[id.toString()]);
			clearTimeout(timeoutsRef.current[`delete_${id}`]);
		};
	}, [duration, id]);

	let Icon = FaInfo;

	switch (type) {
		case ToastType.ERROR:
			Icon = FaExclamation;
			break;
		case ToastType.SUCCESS:
			Icon = FaCheck;
			break;
		case ToastType.INFO:
			Icon = FaInfo;
			break;
		default:
			Icon = FaExclamation;
			break;
	}

	return (
		<div
			className={clsx(
				'w-full rounded-2xl bg-highlight p-4 relative text-foreground pointer-events-auto',
				isVisible ? 'opacity-100 translate-y-0 ' : 'opacity-0 translate-y-10 invisible'
			)}
		>
			<div className='bg-background flex items-center gap-4 w-full p-4 rounded-xl'>
				<Icon className='' />
				<div>
					<span className='font-bold'>{name}</span>
					<br />
					<span>{message}</span>
				</div>
				<button type='button' onClick={() => deleteToast(id)}>
					<FaX />
				</button>
			</div>
		</div>
	);
}
