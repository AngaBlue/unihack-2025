"use client";
import { useThree } from "./ThreeContext";
import { useEffect } from "react";
import * as THREE from "three";

const Terrarium = () => {
  const { scene, camera } = useThree();

  useEffect(() => {
    const geometry = new THREE.BoxGeometry(150, 150, 150);
    const edges = new THREE.EdgesGeometry(geometry);

    const material = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        linejoin: 'bevel',
        opacity: 0.8
    });

    // Create the line segments for the cube edges
    const line = new THREE.LineSegments(edges, material);
    
    // Add the line segments (edges) to the scene
    scene.add(line);

    // Move the edges around (same as the cube)
    line.position.set(0, 0, -5);

    // Animation loop to update the scene
    const animate = () => {
      line.rotation.y += 0.0005;
      requestAnimationFrame(animate);
    };

    animate();
  }, [scene, camera]);

  return null; // Nothing to render in the DOM directly for now
};

export default Terrarium;
