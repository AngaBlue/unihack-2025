'use client';
import { type ReactNode, createContext, useContext } from 'react';
import type * as THREE from 'three';

interface ThreeContextType {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera | null;
	renderer: THREE.WebGLRenderer | null;
}

const ThreeContext = createContext<ThreeContextType | undefined>(undefined);

export const useThree = () => {
	const context = useContext(ThreeContext);
	if (!context) {
		throw new Error('useThree must be used within a ThreeProvider');
	}
	return context;
};

interface ThreeProviderProps extends ThreeContextType {
	children: ReactNode;
}

export function ThreeProvider({ children, ...props }: ThreeProviderProps) {
	return <ThreeContext.Provider value={props}>{children}</ThreeContext.Provider>;
}
