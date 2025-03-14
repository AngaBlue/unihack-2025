/* 
Created a new react context that stores the three js scene and camera objects.
That way any children component that we wanna render can take from this and use it to render 3d objects.
*/

import { createContext, useContext } from "react";
import * as THREE from "three";

interface ThreeContextType {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

const ThreeContext = createContext<ThreeContextType | undefined>(undefined);

export const useThree = () => {
  const context = useContext(ThreeContext);
  if (!context) {
    throw new Error("useThree must be used within a ThreeProvider");
  }
  return context;
};

export const ThreeProvider: React.FC<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; children: React.ReactNode }> = ({ scene, camera, children }) => {
  return <ThreeContext.Provider value={{ scene, camera }}>{children}</ThreeContext.Provider>;
};
