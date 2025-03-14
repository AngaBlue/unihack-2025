'use client';
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeEnvironment = () => {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer();

		// Attach renderer to div
		renderer.setSize(window.innerWidth, window.innerHeight);
		if (mountRef.current) {
			mountRef.current.appendChild(renderer.domElement);
		}

		// Create cube
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		camera.position.z = 5;

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		};
		animate();

		// Cleanup
		return () => {
			renderer.dispose();
		};
	}, []);

	return <div ref={mountRef} />;
};

export default ThreeEnvironment;
