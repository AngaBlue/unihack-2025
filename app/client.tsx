'use client';

import { hydrate } from '@/util/hydrated';
import { ToastType, createToast } from '@/util/toasts';
import { useEffect } from 'react';
import ToastWrapper from './components/ToastWrapper';

export default function Client() {
	useEffect(() => {
		hydrate();
		createToast({
			name: 'Growth Garden',
			message: 'What does growth mean to you?',
			type: ToastType.INFO
		});
	}, []);

	return <ToastWrapper />;
}
