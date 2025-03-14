"use client";
import { useThree } from "./ThreeContext";
import { useEffect } from "react";
import * as THREE from "three";

const Terrarium = () => {
  const { scene, camera } = useThree();

  useEffect(() => {
    // Use scene and camera to add a floating cube or any other objects
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Move cube around (just an example)
    cube.position.set(0, 0, -5);

    // Animation loop to update the scene
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      requestAnimationFrame(animate);
    };

    animate();
  }, [scene, camera]);

  return null; // Nothing to render in the DOM directly for now
};

export default Terrarium;
