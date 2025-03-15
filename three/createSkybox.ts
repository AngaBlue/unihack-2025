import * as THREE from 'three';

/**
 * Creates the skybox mesh.
 * @returns Skybox mesh.
 */
export default function createSkybox() {
	const texture_ft = new THREE.TextureLoader().load('/space_ft.png');
	const texture_bk = new THREE.TextureLoader().load('/space_bk.png');
	const texture_up = new THREE.TextureLoader().load('/space_up.png');
	const texture_dn = new THREE.TextureLoader().load('/space_dn.png');
	const texture_rt = new THREE.TextureLoader().load('/space_rt.png');
	const texture_lf = new THREE.TextureLoader().load('/space_lf.png');

	// Textures
	const textures = [
		new THREE.MeshBasicMaterial({ map: texture_ft, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_bk, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_up, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_dn, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_rt, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_lf, side: THREE.BackSide })
	];

	const geometry = new THREE.BoxGeometry(10000, 10000, 10000);
	const mesh = new THREE.Mesh(geometry, textures);

	return mesh;
}
