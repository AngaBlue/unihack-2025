import Terrarium from './Terrarium';
import TerrariumTwo from './TerrariumTwo';
import { ThreeProvider } from './ThreeContext';
import ThreeEnvironment from './ThreeEnvironment';
import * as THREE from 'three';

function App() {
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 45, 30000);

	return (
		<div>
			<ThreeProvider scene={scene} camera={camera}>
			<ThreeEnvironment>
				<Terrarium />
				<TerrariumTwo />
			</ThreeEnvironment>
			</ThreeProvider>
		</div>
	);
}

export default App;
