'use client';

import { SpeechModal, speechChain } from '@/app/components/SpeechModal';
import init from '@/three/init';
import { hydrate } from '@/util/hydrated';
import { ToastType, createToast } from '@/util/toasts';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeProvider } from './ThreeContext';
import ToastWrapper from './components/ToastWrapper';

export default function Client() {
	const [scene, setScene] = useState<THREE.Scene | null>(null);
	const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		hydrate();
		createToast({
			name: 'Growth Garden',
			message: 'What does growth mean to you?',
			type: ToastType.INFO
		});

		// Now safe to use window
		const newScene = new THREE.Scene();
		const newCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000);

		if (!scene) setScene(newScene);
		if (!camera) setCamera(newCamera);
		if (!ref.current) return;

		init(newScene, newCamera, ref.current);
	}, [scene, camera, ref]);

	if (!(scene && camera)) return null;

	return (
		<ThreeProvider scene={scene} camera={camera}>
			<SpeechModal speechChain={speechChain} />
			<ToastWrapper />
			<div ref={ref} />
		</ThreeProvider>
	);
}
