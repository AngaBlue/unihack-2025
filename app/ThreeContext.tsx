// ThreeContext.tsx
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
