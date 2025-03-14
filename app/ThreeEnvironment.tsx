'use client';
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { ThreeProvider } from "./ThreeContext";

const ThreeEnvironment: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scene = useRef(new THREE.Scene()).current;
  const camera = useRef(new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000)).current;

  useEffect(() => {
    camera.position.set(0, 0, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    if (mountRef.current) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => renderer.render(scene, camera));

    // Fix the skybox
    controls.minDistance = 10;
    controls.maxDistance = 1500;

	// get textures from public and append to the skybox
    const texture_ft = new THREE.TextureLoader().load("/space_ft.png");
    const texture_bk = new THREE.TextureLoader().load("/space_bk.png");
    const texture_up = new THREE.TextureLoader().load("/space_up.png");
    const texture_dn = new THREE.TextureLoader().load("/space_dn.png");
    const texture_rt = new THREE.TextureLoader().load("/space_rt.png");
    const texture_lf = new THREE.TextureLoader().load("/space_lf.png");

    const skyboxArray = [
      new THREE.MeshBasicMaterial({ map: texture_ft, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_bk, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_up, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_dn, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_rt, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: texture_lf, side: THREE.BackSide }),
    ];

    const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(skyboxGeo, skyboxArray);
    scene.add(skybox);

    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  }, [scene, camera]);

  return (
    <div ref={mountRef}>
      <ThreeProvider scene={scene} camera={camera}>
        {children}
      </ThreeProvider>
    </div>
  );
};

export default ThreeEnvironment;
