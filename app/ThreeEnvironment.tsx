"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TGALoader, OrbitControls } from "three-stdlib";

const ThreeEnvironment = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 45, 30000);
    camera.position.set(0, 0, 500);  

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    if (mountRef.current) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
    }

    // Set up OrbitControls
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => renderer.render(scene, camera));

	controls.minDistance = 500;
	controls.maxDistance = 1500;

    // Load textures for the skybox
    let texture_ft = new TGALoader().load('/galaxy-X.tga');
    let texture_bk = new TGALoader().load('/galaxy-Y.tga');
    let texture_up = new TGALoader().load('/galaxy-Z.tga');
    let texture_dn = new TGALoader().load('/galaxy+X.tga');
    let texture_rt = new TGALoader().load('/galaxy+Y.tga');
    let texture_lf = new TGALoader().load('/galaxy+Z.tga');

    let skyboxArray = [
      new THREE.MeshBasicMaterial({ map: texture_ft, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_bk, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_up, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_dn, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_rt, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_lf, side: THREE.BackSide })
    ];

    let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    let skybox = new THREE.Mesh(skyboxGeo, skyboxArray);
    scene.add(skybox);

    // Start the animation loop
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

  }, []);

  return <div ref={mountRef} />;
};

export default ThreeEnvironment;
