import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';


export default function init(scene: THREE.Scene, camera: THREE.PerspectiveCamera, div: HTMLDivElement) {
    camera.position.set(0, 0, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    div.appendChild(renderer.domElement);
    
    // adding mesh for sphere planet
    const geometry = new THREE.SphereGeometry( 100, 100, 100 ); 
    const material = new THREE.MeshPhysicalMaterial({color: 0xCBC3E3, roughness: 0.5});
    const sphere = new THREE.Mesh( geometry, material); 
    sphere.castShadow = true;

    /**
     * SPHERE POSITION IS 10,10,10
     */
    sphere.position.set(10,10,10);

        
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = sphere.position;
    controls.addEventListener('change', () => renderer.render(scene, camera));

    /* Bug fix, ensure that users cannot exceed skybox dimension */
    controls.minDistance = sphere.position.getComponent(1) + 300;
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

    const directionalLight = new THREE.DirectionalLight(0xE8B5BD, 0.7);
    directionalLight.position.set(100, 100, 100).normalize();
    directionalLight.target = sphere;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xE8B5BD, 0.03);
    ambientLight.position.set(-100, 100, -100);

    scene.add(ambientLight);


    /**
     * adding mushroom
     */
    const mtlLoader = new MTLLoader();
		mtlLoader.setPath('/');
		mtlLoader.load('mushrooms.mtl', materials => {
			materials.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath('/');
			objLoader.load('mushrooms.obj', object => {
				object.position.set(0, 0, -5);
				object.scale.set(50, 50, 50);
				scene.add(object);
			});
        }
    )

    // ANIMATION LOOP
    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();


    // sphere.minDistance = 30; 
    // sphere.maxDistance = 50; 
    scene.add( sphere );


}
