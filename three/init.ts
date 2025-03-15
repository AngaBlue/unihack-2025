import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { DragControls } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib'; 
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

var startColor:any;
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
    const fbxLoader = new FBXLoader();
    fbxLoader.load('Robot.fbx', (object) => {
        object.position.set(-200, 150, 0);
        object.scale.set(25, 25, 25);
        scene.add(object);
    
        // Initialize the Animation Mixer
        const mixer = new THREE.AnimationMixer(object);
    
        // Loop through animations and store them
        object.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            animationActions.push(action);
        });
    
        // Play the first animation
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
            console.log("called")
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
    
        renderer.render(scene, camera);
    };

    animate();


    // sphere.minDistance = 30; 
    // sphere.maxDistance = 50; 
    scene.add( sphere );


}
