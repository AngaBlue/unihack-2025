'use client';
import { type ReactNode, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

interface ThreeEnvironmentProps {
	children?: ReactNode;
}

/* 

THREE ENVIRONMENT CONTAINS THE THREEJS SCENE AND CAMERA AS WELL AS THE SKYBOX RENDERING

*/

const ThreeEnvironment: React.FC<ThreeEnvironmentProps> = ({ children }) => {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000);
		camera.position.set(0, 0, 500);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		if (mountRef.current) {
			renderer.setSize(window.innerWidth, window.innerHeight);
			mountRef.current.appendChild(renderer.domElement);
		}

		// Orbit controls - not really sure what this will be doing but
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', () => renderer.render(scene, camera));

		/* Bug fix, ensure that users cannot exceed skybox dimension */
		controls.minDistance = 10;
		controls.maxDistance = 1500;

		const texture_ft = new THREE.TextureLoader().load('/space_ft.png');
		const texture_bk = new THREE.TextureLoader().load('/space_bk.png');
		const texture_up = new THREE.TextureLoader().load('/space_up.png');
		const texture_dn = new THREE.TextureLoader().load('/space_dn.png');
		const texture_rt = new THREE.TextureLoader().load('/space_rt.png');
		const texture_lf = new THREE.TextureLoader().load('/space_lf.png');

		// texture array
		const skyboxArray = [
			new THREE.MeshBasicMaterial({ map: texture_ft, side: THREE.BackSide }),
			new THREE.MeshBasicMaterial({ map: texture_bk, side: THREE.BackSide }),
			new THREE.MeshBasicMaterial({ map: texture_up, side: THREE.BackSide }),
			new THREE.MeshBasicMaterial({ map: texture_dn, side: THREE.BackSide }),
			new THREE.MeshBasicMaterial({ map: texture_rt, side: THREE.BackSide }),
			new THREE.MeshBasicMaterial({ map: texture_lf, side: THREE.BackSide })
		];

		const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
		const skybox = new THREE.Mesh(skyboxGeo, skyboxArray);
		scene.add(skybox);

		// ANIMATION LOOP
		const animate = () => {
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		};

		animate();
	}, []);

	// threejs scene is mounted here, children will include idk everything else i suppose
	return <div ref={mountRef}>{children}</div>;
};

export default ThreeEnvironment;
