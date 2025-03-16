'use client';
import ChatHandler from '@/components/ChatHandler';
import init from '@/three/init';
import { hydrate } from '@/util/hydrated';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import BackgroundMusic from '../components/BackgroundMusic';
import { GoalProvider } from '../context/GoalContext';
import { ThreeProvider } from '../context/ThreeContext';

export default function Client() {
	const sceneRef = useRef(new THREE.Scene());
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		hydrate();

		// Scene
		const scene = sceneRef.current;

		// Camera
		if (!cameraRef.current) {
			cameraRef.current = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000);
			cameraRef.current.position.set(0, 0, 100);
		}
		const camera = cameraRef.current;

		// Ensure container exists
		if (!divRef.current) return;

		// Renderer
		if (!rendererRef.current) {
			rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
			rendererRef.current.setSize(window.innerWidth, window.innerHeight);
			divRef.current.appendChild(rendererRef.current.domElement);
		}
		const renderer = rendererRef.current;

		// Handle window resizing
		const handleResize = () => {
			if (camera && rendererRef.current) {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				rendererRef.current.setSize(window.innerWidth, window.innerHeight);
			}
		};
		window.addEventListener('resize', handleResize);

		// Populate scene with objects
		init(scene, camera, renderer);

		// Cleanup on unmount
		return () => {
			window.removeEventListener('resize', handleResize);
			if (divRef.current && rendererRef.current) {
				divRef.current.removeChild(rendererRef.current.domElement);
			}
		};
	}, [sceneRef.current, cameraRef.current, divRef.current]);

	return (
		<GoalProvider>
			<ThreeProvider scene={sceneRef.current} camera={cameraRef.current} renderer={rendererRef.current}>
				<BackgroundMusic />
				<ChatHandler />
				<div ref={divRef} />
			</ThreeProvider>
		</GoalProvider>
	);
}
