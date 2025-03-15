'use client';

import { SpeechModal, speechChain } from '@/app/components/SpeechModal';
import init from '@/three/init';
import { hydrate } from '@/util/hydrated';
import { ToastType, createToast } from '@/util/toasts';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeProvider } from './ThreeContext';
import BackgroundMusic from './components/BackgroundMusic';
import ToastWrapper from './components/ToastWrapper';

export default function Client() {
	const [scene, setScene] = useState<THREE.Scene | null>(null);
	const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		hydrate();

		// Scene
		if (!scene) {
			const newScene = new THREE.Scene();
			setScene(newScene);
		}

		// Camera
		if (!camera) {
			const newCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000);
			setCamera(newCamera);
		}

		// Null-check ref, scene & camera
		if (!(ref.current && scene && camera)) return;

		createToast({
			name: 'Growth Garden',
			message: 'What does growth mean to you?',
			type: ToastType.INFO
		});

		init(scene, camera, ref.current);
	}, [scene, camera, ref]);

	if (!(scene && camera)) return null;

	return (
		<ThreeProvider scene={scene} camera={camera}>
			<BackgroundMusic />
			{/* <SpeechModal speechChain={speechChain} /> */}
			<ToastWrapper />
			<div ref={ref} />
		</ThreeProvider>
	);
}
