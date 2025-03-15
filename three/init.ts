import { RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export default function init(scene: THREE.Scene, camera: THREE.PerspectiveCamera, div: HTMLDivElement) {
    
    camera.position.set(0, 0, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    div.appendChild(renderer.domElement);

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

    // LIGHTS 
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);


    // ANIMATION LOOP
    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // adding mesh for sphere planet
    const geometry = new THREE.SphereGeometry( 15, 32, 16 ); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
    const sphere = new THREE.Mesh( geometry, material ); 
    sphere.minDistance = 30; 
    sphere.maxDistance = 50; 
    scene.add( sphere );




}