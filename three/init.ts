import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { DragControls } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';
import { ImprovedNoise } from 'three-stdlib';
import createSkybox from './createSkybox';
import getFresnelMat from './getFresnelMat';

interface DragEvent {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	object: any;
}

const SCALE_FACTOR = 10;
export default function init(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
	const startColor = '';
	camera.position.set(0, 0, 500);

	function getCorona() {
		const radius = 0.85;
		const material = new THREE.MeshBasicMaterial({
			color: 0x186b16,
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

	/**
	 * Add planet
	 */
	const planetRadius = 50;
	const surfaceMargin = 5;
	const geometry = new THREE.IcosahedronGeometry(1, 6);
	const material = new THREE.MeshStandardMaterial({
		emissive: 0x20991c
	});
	const planet = new THREE.Mesh(geometry, material);
	planet.castShadow = true;

	const sunRimMat = getFresnelMat({ rimHex: 0x000000, facingHex: 0x000000 });

	const rimMesh = new THREE.Mesh(geometry, sunRimMat);
	planet.scale.setScalar(planetRadius);
	rimMesh.scale.setScalar(1.001);
	planet.add(rimMesh);

	const coronaMesh = getCorona();
	planet.add(coronaMesh);

	planet.userData.update = (t: number) => {
		coronaMesh.userData.update(t);
	};
	planet.position.set(0, 0, 0);

	/**
	 * Initialise orbit controls for panning camera around the plannet
	 */
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.copy(planet.position);
	controls.addEventListener('change', () => renderer.render(scene, camera));
	controls.minDistance = 100;
	controls.maxDistance = 1500;

	/**
	 * Add skybox background, starfield and nebula 
	 */
	let [starfield, mesh, nebula] = createSkybox();
	scene.add(starfield);
	scene.add(mesh);
	scene.add(nebula);


	/**
	 * Add robot
	 */
	const robotGroup = new THREE.Group(); // Create a parent group
	robotGroup.position.set(100, 10, 100); // Fix this position in the world
	scene.add(robotGroup); // Add to scene

	const fbxLoader = new FBXLoader();
	fbxLoader.load('Robot.fbx', object => {
		object.scale.set(15, 15, 15); // Scale as needed
		robotGroup.add(object); // Add robot to parent group instead of directly to the scene

		mixer = new THREE.AnimationMixer(object);
		for (const clip of object.animations) {
			if (!mixer) continue;
			const action = mixer.clipAction(clip);
			animationActions.push(action);
		}

		if (animationActions.length > 0) {
			activeAction = animationActions[0];
			activeAction.play();
		}
	});

	/**
	 * Add planetObjects
	 */
	const planetObjects: THREE.Object3D[] = [];
	const mtlLoader = new MTLLoader();
	mtlLoader.setPath('/');
	mtlLoader.load('mushrooms.mtl', materials => {
		materials.preload();
		const objLoader = new OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/');

		objLoader.load('mushrooms.obj', (object: THREE.Object3D) => {
			if (object instanceof THREE.Group) {
				object.updateWorldMatrix(true, true);

				for (const child of object.children) {
					object.remove(child);

					// If the child is a Mesh, recenter its geometry.
					if (child instanceof THREE.Mesh && child.geometry) {
						child.geometry.center();
					}

					child.position.set(30, 30, 30);

					child.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);

					scene.add(child);
					planetObjects.push(child);
				}
			} else {
				if (object instanceof THREE.Mesh && object.geometry) {
					object.geometry.center();
				}
				object.position.set(55, 55, 55);
				object.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
				planet.add(object);
				planetObjects.push(object);
			}
			console.log('planetObjects loaded:', planetObjects);
		});
	});

	/**
	 * Adding drag controls for planetObjects
	 */
	const dragControls = new DragControls(planetObjects, camera, renderer.domElement);

	dragControls.addEventListener('dragstart', dragStartCallback);
	dragControls.addEventListener('dragend', dragEndCallback);
	dragControls.addEventListener('drag', dragCallback);

	function dragStartCallback(event: DragEvent) {
		controls.enabled = false;
		event.object.startColor = event.object.material.color.getHex();
		if (event.object.material.color) {
			event.object.material.color.setHex(0x000000);
		}
		// remove the bright light if one exists
		if (event.object.userData.brightLight) {
			event.object.remove(event.object.userData.brightLight);
			event.object.userData.brightLight = null;
		}
	}

	function dragCallback() {
		controls.enabled = false;
	}

	function dragEndCallback(event: DragEvent) {
		controls.enabled = true;
		if (event.object.material.color) {
			event.object.material.color.setHex(event.object.startColor );
		}

		const mushroom = event.object;

		// const currentDistance = Math.abs(mushroom.position.length())
		const targetDistance = planetRadius;
		console.log(
			'currentDistance',
			mushroom.position,
			'targetDistance',
			targetDistance,
			'planet position',
			planet.position,
			'mushroom local position',
			mushroom.position
		);

		// calculate the normalized direction from the planet's center to the mushroom.
		const direction = mushroom.position.clone().normalize();

		// scale direction by targetDistance
		mushroom.position.copy(direction.multiplyScalar(planetRadius + surfaceMargin));
		console.log('mushroom position', mushroom.position);

		// Update the mushroom's orientation so it faces outward from the planet.
		mushroom.up.copy(direction);
		mushroom.lookAt(mushroom.position.clone().add(direction));
		mushroom.rotateX(Math.PI / 2);
		console.log('new distance', mushroom.position.length());

		/**
		 * Add per object lighting
		 */
		const brightLight = new THREE.PointLight(0xff0099, 50, 100);
		brightLight.position.set(0, 0, 0);
		mushroom.add(brightLight);
		mushroom.userData.brightLight = brightLight;
	}

	/**
	 * Add directional and ambient lighting
	 */
	const directionalLight = new THREE.DirectionalLight(0xfbeee6, 1.5); //0xe8b5bd
	directionalLight.position.set(100, 100, 100).normalize();
	directionalLight.target = planet;
	scene.add(directionalLight);

	const ambientLight = new THREE.AmbientLight(0xfbeee6, 0.5);
	ambientLight.position.set(100, 100, 100);

	scene.add(ambientLight);

	const animationActions: THREE.AnimationAction[] = [];
	let activeAction: THREE.AnimationAction;
	let mixer: THREE.AnimationMixer | null = null;

	/**
	 * Animation loop
	 */
	const clock = new THREE.Clock();
	const animate = () => {
		requestAnimationFrame(animate);
		const delta = clock.getDelta();
		if (mixer) mixer.update(delta);
		planet.userData.update(clock.elapsedTime);
		renderer.render(scene, camera);
	};

	animate();
	scene.add(planet);
}
