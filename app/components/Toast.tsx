'use client';

import { type Toast, ToastType, deleteToast } from '@/util/toasts';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaExclamation, FaInfo } from 'react-icons/fa';

export default function BaseToast({ id, type, name, message, duration }: Toast) {
	const [isVisible, setIsVisible] = useState(false);
	const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({}); // Object to hold the timeouts

	const [progressBarStyle, setProgressBarStyle] = useState({});

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

		setProgressBarStyle({
			animationName: 'progressBar',
			animationTimingFunction: 'linear',
			animationDuration: `${duration - 300}ms`,
			animationFillMode: 'forwards' // Keeps the state at the end of the animation
		});

		timeoutsRef.current[id.toString()] = fadeOutTimeout; // Store the fadeOutTimeout for cleanup

		return () => {
			// Clear the timeouts when the component is unmounted or dependencies change
			clearTimeout(timeoutsRef.current[id.toString()]);
			clearTimeout(timeoutsRef.current[`delete_${id}`]);
		};
	}, [duration, id]);

	let background = 'bg-[#2196f3]';
	let icon = <FaInfo className='text-[#2196f3]' />;

	switch (type) {
		case ToastType.ERROR:
			background = 'bg-[#ff5252]';
			icon = <FaExclamation className='text-[#fff]' />;
			break;
		case ToastType.SUCCESS:
			background = 'bg-[#4caf50]';
			icon = <FaCheck className='text-[#fff]' />;
			break;
		case ToastType.INFO:
			background = 'bg-[#2196f3]';
			icon = <FaInfo className='text-[#fff]' />;
			break;
		default:
			break;
	}

	return (
		<div className='fixed bottom-8 transition-all flex items-center justify-center duration-300 min-w-[280px] min-h-[60px]'>
			<div
				className={clsx(
					background,
					'rounded-lg h-[60px] px-[25px] text-white flex justify-start items-center gap-4 font-semibold w-full min-w-fit max-w-full transition-all duration-300 ease-out relative pointer-events-auto',
					isVisible ? 'opacity-100 translate-y-0 ' : 'opacity-0 translate-y-10 invisible'
				)}
			>
				{icon}
				<button type='button'>X</button>
			</div>
			{name}
			{message}
			<div
				className={clsx(
					'w-full h-1 rounded-b-lg absolute z-10 left-0 bottom-0 transition-all duration-300 ease-out',
					isVisible ? 'opacity-100 translate-y-0 ' : 'opacity-0 translate-y-10 invisible'
				)}
			>
				<div className='h-full bg-white rounded-bl-lg ' style={progressBarStyle} />
			</div>
		</div>
	);
}
