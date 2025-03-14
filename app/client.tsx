'use client';

import { hydrate } from '@/util/hydrated';
import { ToastType, createToast } from '@/util/toasts';
import { useEffect } from 'react';
import Terrarium from './Terrarium';
import TerrariumTwo from './TerrariumTwo';
import { ThreeProvider } from './ThreeContext';
import ThreeEnvironment from './ThreeEnvironment';
import * as THREE from 'three';

export default function Client() {
	useEffect(() => {
		hydrate();
		createToast({
			name: 'Growth Garden',
			message: 'What does growth mean to you?',
			type: ToastType.INFO
		});
	}, []);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000);

	return (
		<ThreeProvider scene={scene} camera={camera}>
			<ThreeEnvironment>
				<Terrarium />
				<TerrariumTwo />
			</ThreeEnvironment>
		</ThreeProvider>
	);
}
