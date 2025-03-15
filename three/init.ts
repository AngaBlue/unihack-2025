import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { DragControls } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';
import { ImprovedNoise } from 'three-stdlib';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import createSkybox from './createSkybox';
import { getFresnelMat } from './getFresnelMat';

var startColor: any;
export default function init(scene: THREE.Scene, camera: THREE.PerspectiveCamera, div: HTMLDivElement) {
	function getCorona() {
		const radius = 0.9;
		const material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			side: THREE.BackSide
		});
		const geo = new THREE.IcosahedronGeometry(radius, 6);
		const mesh = new THREE.Mesh(geo, material);
		const noise = new ImprovedNoise();

		const v3 = new THREE.Vector3();
		const p = new THREE.Vector3();
		const pos = geo.attributes.position;
		// @ts-ignore
		pos.usage = THREE.DynamicDrawUsage;
		const len = pos.count;

		function update(t: number) {
			for (let i = 0; i < len; i += 1) {
				p.fromBufferAttribute(pos, i).normalize();
				v3.copy(p).multiplyScalar(3.0);
				const ns = noise.noise(v3.x + Math.cos(t), v3.y + Math.sin(t), v3.z + t);
				v3.copy(p)
					.setLength(radius)
					.addScaledVector(p, ns * 0.4);
				pos.setXYZ(i, v3.x, v3.y, v3.z);
			}
			pos.needsUpdate = true;
		}
		mesh.userData.update = update;
		return mesh;
	}

	camera.position.set(0, 0, 500);

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	div.appendChild(renderer.domElement);

	// adding mesh for sphere planet

	const geometry = new THREE.IcosahedronGeometry(1, 6);
	const material = new THREE.MeshStandardMaterial({
		emissive: 0x5d3fd3
	});
	const sphere = new THREE.Mesh(geometry, material);
	sphere.castShadow = true;

	const sunRimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
	const rimMesh = new THREE.Mesh(geometry, sunRimMat);
	sphere.scale.setScalar(50);
	rimMesh.scale.setScalar(1.01);
	sphere.add(rimMesh);

	const coronaMesh = getCorona();
	sphere.add(coronaMesh);

	sphere.userData.update = (t: number) => {
		// sphere.rotation.y = t;
		coronaMesh.userData.update(t);
	};

	/**
	 * SPHERE POSITION IS 10,10,10
	 */
	sphere.position.set(0, 0, 0);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target = sphere.position;
	controls.addEventListener('change', () => renderer.render(scene, camera));

	/* Bug fix, ensure that users cannot exceed skybox dimension */
	controls.minDistance = sphere.position.getComponent(1) + 300;
	controls.maxDistance = 1500;
	scene.add(createSkybox());

	const directionalLight = new THREE.DirectionalLight(0xe8b5bd, 0.8);
	directionalLight.position.set(100, 100, 100).normalize();
	directionalLight.target = sphere;
	scene.add(directionalLight);

	const ambientLight = new THREE.AmbientLight(0xe8b5bd, 0.00005);
	ambientLight.position.set(-100, 100, -100);

	scene.add(ambientLight);

	const animationActions: THREE.AnimationAction[] = [];
	let activeAction: THREE.AnimationAction;
	let mixer: THREE.AnimationMixer | null = null;
	/**
	 *
	 * ADDING ROBOT THROUGH FBX LOADER
	 */

	const robotGroup = new THREE.Group(); // Create a parent group
	robotGroup.position.set(100, 10, 100); // Fix this position in the world
	scene.add(robotGroup); // Add to scene

	const fbxLoader = new FBXLoader();
	fbxLoader.load('Robot.fbx', object => {
		object.scale.set(50, 50, 50); // Scale as needed
		robotGroup.add(object); // Add robot to parent group instead of directly to the scene

		mixer = new THREE.AnimationMixer(object);
		object.animations.forEach(clip => {
			const action = mixer!.clipAction(clip);
			animationActions.push(action);
		});

		if (animationActions.length > 0) {
			activeAction = animationActions[0];
			activeAction.play();
		}
	});

	/**
	 * adding mushroom
	 */
	var objects: THREE.Group<THREE.Object3DEventMap>[] = [];

	const mtlLoader = new MTLLoader();
	mtlLoader.setPath('/');
	mtlLoader.load('mushrooms.mtl', materials => {
		materials.preload();
		const objLoader = new OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/');
		objLoader.load('mushrooms.obj', object => {
			object.position.set(50, 50, 50);
			object.scale.set(10, 10, 10);
			scene.add(object);
			objects.push(object);
		});
	});
	/**
	 * Adding drag movement to mushroom
	 */

	const dragControls = new DragControls(objects, camera, renderer.domElement);
	dragControls.addEventListener('dragstart', dragStartCallback);
	dragControls.addEventListener('dragend', dragendCallback);

	const pointLockControls = new PointerLockControls(camera, document.body);
	/**
	 * Cast shadow (darken colour) of selected mushroom
	 */
	function dragStartCallback(event: any) {
		// pointLockControls.lock()
		controls.enabled = false; // Disable OrbitControls

		startColor = event.object.material.color.getHex();
		event.object.material.color.setHex(0x000000);
	}

	function dragendCallback(event: any) {
		controls.enabled = true;
		event.object.material.color.setHex(startColor);
		// pointLockControls.unlock()
	}

	const clock = new THREE.Clock();

	// ANIMATION LOOP
	const animate = () => {
		requestAnimationFrame(animate);

		const delta = clock.getDelta(); // Get time elapsed since last frame
		if (mixer) mixer.update(delta); // Update animation
		sphere.userData.update(clock.elapsedTime);

		renderer.render(scene, camera);
	};

	animate();
	scene.add(sphere);
}
