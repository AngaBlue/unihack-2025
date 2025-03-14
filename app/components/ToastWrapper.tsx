'use client';

import { hydrated } from '@/util/hydrated';
import type { Toast } from '@/util/toasts';
import useSWR from 'swr';
import ToastNotification from './ToastNotification';

export default function ToastWrapper() {
	const { data: toasts } = useSWR<Toast[]>('toasts');

	return (
		<div className='absolute top-0 left-0 h-screen w-screen pointer-events-none'>
			<div className='absolute top-0 right-0 h-full w-96 overflow-hidden flex flex-col gap-2 items-center transition-all z-[99] p-4'>
				{/* Do not display the toasts if the page has not yet hydrated */}
				{hydrated && toasts?.map(toast => <ToastNotification {...toast} key={toast.id} />)}
			</div>
		</div>
	);
}
