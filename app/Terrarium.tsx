'use client';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from './ThreeContext';

const Terrarium = () => {
	const { scene, camera } = useThree();

	useEffect(() => {
		const geometry = new THREE.SphereGeometry( 15, 32, 16 ); 
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere );
		// const geometry = new THREE.BoxGeometry(150, 150, 150);
		// const edges = new THREE.EdgesGeometry(geometry);

		// const material = new THREE.LineBasicMaterial({
		// 	color: 0xffffff,
		// 	transparent: true,
		// 	linejoin: 'bevel',
		// 	opacity: 0.8
		// });

		// const line = new THREE.LineSegments(edges, material);

		scene.add(line);

		// line.position.set(0, 0, -5);

		// Animation loop to update the scene
		const animate = () => {
			// line.rotation.y += 0.0005;
			requestAnimationFrame(animate);
		};

		animate();
	}, [scene, camera]);

	return null; // Nothing to render in the DOM directly for now
};

export default Terrarium;
