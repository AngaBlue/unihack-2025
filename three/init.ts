import { hydration } from '@/util/hydrated';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { DragControls } from 'three-stdlib';
import { ImprovedNoise } from 'three-stdlib';
import createSkybox from './createSkybox';
import getFresnelMat from './getFresnelMat';

interface DragEvent {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	object: any;
}

let pickUpAudio: HTMLAudioElement | null = null;
let placeAudio: HTMLAudioElement | null = null;

(async () => {
	await hydration.promise;
	pickUpAudio = new Audio('/sounds/pluck_mushroom.mp3');
	placeAudio = new Audio('/sounds/place.mp3');
})();

const OBJECT_SIZE = 13;
const OBJECT_SPAWN_LOCATION: THREE.Vector3Tuple = [40, 40, 40];
const planetObjects: THREE.Object3D[] = [];
export default function init(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
	camera.position.set(0, 0, 500);

	function getCorona() {
		const radius = 0.85;
		const material = new THREE.MeshBasicMaterial({
			color: 0x7fb58d,
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
				v3.copy(p).multiplyScalar(2.5);
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

	camera.position.set(0, 0, 300);

	/**
	 * Add planet
	 */
	const planetRadius = 50;
	const geometry = new THREE.IcosahedronGeometry(1, 6);
	const material = new THREE.MeshStandardMaterial({
		color: 0x568562
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
	const [starfield, mesh, nebula] = createSkybox();
	scene.add(starfield);
	scene.add(mesh);
	scene.add(nebula);

	/**
	 * Add planetObjects
	 */
	const mtlLoader = new MTLLoader();
	mtlLoader.setPath('/');

	/**
	 * Adding drag controls for planetObjects
	 */
	const dragControls = new DragControls(planetObjects, camera, renderer.domElement);

	dragControls.addEventListener('dragstart', dragStartCallback);
	dragControls.addEventListener('dragend', dragEndCallback);
	dragControls.addEventListener('drag', dragCallback);

	function dragStartCallback(event: DragEvent) {
		controls.enabled = false;

		if (event.object.material.color) {
			event.object.startColor = event.object.material.color.getHex();
			event.object.material.color.setHex(0x000000);
		}
		// remove the bright light if one exists
		if (event.object.userData.brightLight) {
			event.object.remove(event.object.userData.brightLight);
			event.object.userData.brightLight = null;
		}

		const glowChild = scene.getObjectByName('glowMesh');
		if (glowChild) scene.remove(glowChild);

		try {
			pickUpAudio?.play();
		} catch (error) {
			console.log(error);
		}
	}

	function dragCallback() {
		controls.enabled = false;
	}

	function dragEndCallback(event: DragEvent) {
		controls.enabled = true;
		if (event.object.material.color) {
			event.object.material.color.setHex(event.object.startColor);
		}

		const mushroom = event.object;

		// calculate the normalized direction from the planet's center to the mushroom.
		const direction = mushroom.position.clone().normalize();

		// scale direction by targetDistance
		const surfaceMargin = mushroom.userData.height * 0.5;
		console.log(' mushroom.userData.height', mushroom.userData.height, 'surfaceMargin', surfaceMargin);
		mushroom.position.copy(direction.multiplyScalar(planetRadius + surfaceMargin));

		// Update the mushroom's orientation so it faces outward from the planet.
		mushroom.up.copy(direction);
		mushroom.lookAt(mushroom.position.clone().add(direction));
		mushroom.rotateX(Math.PI / 2);

		// Add point lighting
		const brightLight = new THREE.PointLight(0xff0099, 50, 100);
		brightLight.position.set(0, 0, 0);
		mushroom.add(brightLight);
		mushroom.userData.brightLight = brightLight;

		try {
			placeAudio?.play();
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Add directional and ambient lighting
	 */
	const directionalLight = new THREE.DirectionalLight(0xfbeee6, 2.75); //0xe8b5bd
	directionalLight.position.set(100, 100, 100).normalize();
	directionalLight.target = planet;
	scene.add(directionalLight);

	const ambientLight = new THREE.AmbientLight(0xfbeee6, 0.5);
	ambientLight.position.set(100, 100, 100);

	scene.add(ambientLight);

	/**
	 * Animation loop
	 */
	const clock = new THREE.Clock();
	const animate = () => {
		requestAnimationFrame(animate);
		const delta = clock.getDelta();
		planet.userData.update(clock.elapsedTime);
		renderer.render(scene, camera);
	};
	animate();
	scene.add(planet);
	// addRandomObject(scene);
	addInitialTerrain(scene, 50);
}

const loadedNumbers = new Set<number>();

/**
 * Adding initial terrain
 */
function addInitialTerrain(scene: THREE.Scene, planetRadius: number) {
	const mtlLoader = new MTLLoader();

	mtlLoader.load(`objects/grass.mtl`, materials => {
		materials.preload();

		const objLoader = new OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/');

		objLoader.load(`objects/grass.obj`, (loadedObject: THREE.Object3D) => {
			// Create 6 distinct grass objects
			for (let i = 0; i < 30; i++) {
				const object = loadedClone(loadedObject);

				// Set random position around the sphere
				object.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

				object.scale.set(35, 35, 35);

				attachObjectToPlanet(object, planetRadius);
				scene.add(object);
			}
		});

		objLoader.load(`objects/rocks.obj`, (loadedObject: THREE.Object3D) => {
			// Create 6 distinct grass objects
			for (let i = 0; i < 10; i++) {
				const object = loadedClone(loadedObject);

				// Set random position around the sphere
				object.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

				object.scale.set(10, 10, 10);

				attachObjectToPlanet(object, planetRadius);
				scene.add(object);
			}
		});
	});
}

// Helper function for cloning objects
function loadedClone(source: THREE.Object3D): THREE.Object3D {
	const clone = source.clone(true);
	clone.traverse(node => {
		if (node instanceof THREE.Mesh) {
			node.material = (node.material as THREE.Material).clone();
		}
	});
	return clone;
}

/**
 * Adding new object into the game
 */
export function addRandomObject(scene: THREE.Scene) {
	let num: number;
	do {
		num = Math.floor(Math.random() * 9) + 2;
	} while (loadedNumbers.has(num));

	loadedNumbers.add(num);

	const mtlLoader = new MTLLoader();
	mtlLoader.load(`objects/${num}.mtl`, materials => {
		materials.preload();

		const objLoader = new OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/');

		objLoader.load(`objects/${num}.obj`, (object: THREE.Object3D) => {
			if (!(object instanceof THREE.Group)) {
				console.warn('Loaded object is not a group');
				return;
			}

			object.updateWorldMatrix(true, true);

			for (const child of object.children) {
				object.remove(child);

				if (child instanceof THREE.Mesh && child.geometry) {
					child.geometry.center();

					// Compute bounding box and height
					const boundingBox = new THREE.Box3().setFromObject(child);
					const size = new THREE.Vector3();
					boundingBox.getSize(size);
					// Attach computed height to userData
					child.userData.height = size.y;

					// Set initial position
					const targetObjectHeight = num === 8 ? 8 : Math.random() * 5 + OBJECT_SIZE + 0.1 * size.y;
					child.position.set(...OBJECT_SPAWN_LOCATION);
					child.scale.set(targetObjectHeight / size.y, targetObjectHeight / size.y, targetObjectHeight / size.y);
					child.userData.height = targetObjectHeight;
					console.log('targetObjectHeight height:', targetObjectHeight);

					// Add to scene and tracking array
					scene.add(child);
					planetObjects.push(child);
					console.log('planetObjects loaded:', planetObjects);

					/**
					 * Add a glowing light surrounding the object
					 */
					const glowMesh = child.clone();
					glowMesh.material = new THREE.MeshStandardMaterial({
						color: 0x00ffcc,
						emissive: 0x00ffcc,
						emissiveIntensity: 2.0,
						transparent: true,
						opacity: 0.7
					});
					child.position.set(...OBJECT_SPAWN_LOCATION);
					child.scale.set(targetObjectHeight / size.y, targetObjectHeight / size.y, targetObjectHeight / size.y);
					// Name or flag it for easy removal later
					glowMesh.name = 'glowMesh';
					// Attach the glowing mesh as a child of the original
					scene.add(glowMesh);
				}
			}
		});
	});
}

function attachObjectToPlanet(object: THREE.Object3D, planetRadius: number) {
	// Calculate normalized direction from planet center to the object position
	const direction = object.position.clone().normalize();

	// Calculate surface margin based on object's height
	const surfaceMargin = -8; //(object.userData.height ?? 0) * 0.5;

	// Set object's position directly on planet's surface
	object.position.copy(direction.multiplyScalar(planetRadius + surfaceMargin));

	// Orient object to face outward from planet's surface
	object.up.copy(direction);
	object.lookAt(object.position.clone().add(direction));
	object.rotateX(Math.PI / 2);
}
