'use client';

import { hydrated } from '@/util/hydrated';
import type { Toast } from '@/util/toasts';
import useSWR from 'swr';
import ToastNotification from './ToastNotification';

export default function ToastWrapper() {
	const { data: toasts } = useSWR<Toast[]>('toasts');

	return (
		<div className='absolute top-0 left-0 h-screen w-screen pointer-events-none'>
			<div className='absolute top-0 h-full w-full overflow-hidden flex flex-col-reverse gap-2 items-center transition-all z-[9999999] py-4'>
				{/* Do not display the toasts if the page has not yet hydrated */}
				{hydrated && toasts?.map(toast => <ToastNotification {...toast} key={toast.id} />)}
			</div>
		</div>
	);
}
