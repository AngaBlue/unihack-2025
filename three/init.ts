import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { DragControls } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib'; 
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { getFresnelMat } from './getFresnelMat';
import { ImprovedNoise } from 'three-stdlib'; 

var startColor:any;
export default function init(scene: THREE.Scene, camera: THREE.PerspectiveCamera, div: HTMLDivElement) {

    function getCorona() {
        const radius = 0.9;
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide,
        });
        const geo = new THREE.IcosahedronGeometry(radius, 6);
        const mesh = new THREE.Mesh(geo, material);
        const noise = new ImprovedNoise();
    
        let v3 = new THREE.Vector3();
        let p = new THREE.Vector3();
        let pos = geo.attributes.position;
        // @ts-ignore
        pos.usage = THREE.DynamicDrawUsage;
        const len = pos.count;
    
        function update(t: any) {
            for (let i = 0; i < len; i += 1) {
                p.fromBufferAttribute(pos, i).normalize();
                v3.copy(p).multiplyScalar(3.0);
                let ns = noise.noise(v3.x + Math.cos(t), v3.y + Math.sin(t), v3.z + t);
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
        emissive: 0xcf9fff,
    });
    const sphere = new THREE.Mesh( geometry, material); 
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
     * 
     *  const sunMat = new THREE.MeshStandardMaterial({
        emissive: 0xff0000,
    });
    const geo = new THREE.IcosahedronGeometry(1, 6);
    const sun = new THREE.Mesh(geo, sunMat);

    const sunRimMat = getFresnelMat({ rimHex: 0xffff99, facingHex: 0x000000 });
    const rimMesh = new THREE.Mesh(geo, sunRimMat);
    rimMesh.scale.setScalar(1.01);
    sun.add(rimMesh);

    const coronaMesh = getCorona();
    sun.add(coronaMesh);

    const sunLight = new THREE.PointLight(0xffff99, 10);
    sun.add(sunLight);
    sun.userData.update = (t) => {
        sun.rotation.y = t;
        coronaMesh.userData.update(t);
    };
     */

    /**
     * SPHERE POSITION IS 10,10,10
     */
    sphere.position.set(0,0,0);

        
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

    const directionalLight = new THREE.DirectionalLight(0xE8B5BD, 0.6);
    directionalLight.position.set(100, 100, 100).normalize();
    directionalLight.target = sphere;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xE8B5BD, 0.1);
    ambientLight.position.set(-100, 100, -100);

    scene.add(ambientLight);


    let animationActions: THREE.AnimationAction[] = [];
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
    fbxLoader.load('Robot.fbx', (object) => {
        object.scale.set(50, 50, 50); // Scale as needed
        robotGroup.add(object); // Add robot to parent group instead of directly to the scene
    
        mixer = new THREE.AnimationMixer(object);
        object.animations.forEach((clip) => {
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
            objects.push(object)
        });
    }
    )
    /**
     * Adding drag movement to mushroom
     */
    
	let dragControls = new DragControls( objects, camera, renderer.domElement );
	dragControls.addEventListener( 'dragstart', dragStartCallback );
	dragControls.addEventListener( 'dragend', dragendCallback );
    
    const pointLockControls = new PointerLockControls( camera, document.body );
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
        sphere.userData.update(clock.elapsedTime)
    
        renderer.render(scene, camera);
    };

    animate();
    scene.add( sphere );


}
