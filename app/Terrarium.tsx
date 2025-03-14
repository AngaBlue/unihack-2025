'use client';
import { useEffect } from 'react';
import * as THREE from 'three';

const Terrarium = () => {
	useEffect(() => {
		// Get the scene from ThreeEnvironment (we'll assume it's passed down or globally available)
		const scene = new THREE.Scene(); // Access your existing scene from ThreeEnvironment if it's passed
		const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000);

		// Create a cube with transparency
		const geometry = new THREE.BoxGeometry(5, 5, 5);
		const material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.5
		});
		const cube = new THREE.Mesh(geometry, material);

		// Add the cube to the scene
		scene.add(cube);

		// Position the cube in front of the camera
		cube.position.set(0, 0, -50);

		// Animate the cube to make it float
		const animate = () => {
			cube.rotation.x += 0.01; // Rotate the cube
			cube.rotation.y += 0.01;
			cube.position.y = Math.sin(Date.now() * 0.002) * 2; // Floating effect

			// Request next frame for animation loop
			requestAnimationFrame(animate);
		};

		animate();
	}, []);

	return null; // No additional DOM elements are needed
};

export default Terrarium;
