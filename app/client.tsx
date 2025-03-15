'use client';

import { hydrate } from '@/util/hydrated';
import { ToastType, createToast } from '@/util/toasts';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import Terrarium from './Terrarium';
import TerrariumTwo from './TerrariumTwo';
import { ThreeProvider } from './ThreeContext';
import ThreeEnvironment from './ThreeEnvironment';
import { SpeechModal, NextButton, ModalProps } from '@/app/components/SpeechModal';

export default function Client() {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
	const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  
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

		setScene(newScene);
		setCamera(newCamera);
	}, []);

  if (!(scene && camera)) return null;

  	const firstMessage:ModalProps = {
		text:"Hey hey! ",
		nextButton: document.createElement('button')
	};

	return (
		<ThreeProvider scene={scene} camera={camera}>
		<SpeechModal text={firstMessage.text} nextButton={firstMessage.nextButton} ></SpeechModal>
			<ThreeEnvironment>
				<Terrarium />
				<TerrariumTwo />
			</ThreeEnvironment>
		</ThreeProvider>
	);
}
