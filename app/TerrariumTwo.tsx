'use client';
import { useEffect } from 'react';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { useThree } from './ThreeContext';

const TerrariumTwo = () => {
	const { scene, camera } = useThree();

	useEffect(() => {
		const mtlLoader = new MTLLoader();
		mtlLoader.setPath('/');
		mtlLoader.load('mushrooms.mtl', materials => {
			materials.preload();

			const objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath('/');
			objLoader.load('mushrooms.obj', object => {
				object.position.set(0, 0, -5);
				object.scale.set(10, 10, 10);
				scene.add(object);
			});
		});

		return () => {};
	}, [scene]);

	const animate = () => {
		requestAnimationFrame(animate);
	};

	useEffect(() => {
		animate();
	}, [scene, camera]);

	return null;
};

export default TerrariumTwo;
