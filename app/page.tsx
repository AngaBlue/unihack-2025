import Terrarium from './Terrarium';
import TerrariumTwo from './TerrariumTwo';
import ThreeEnvironment from './ThreeEnvironment';

function App() {
	return (
		<div>
			<ThreeEnvironment>
				<Terrarium />
				<TerrariumTwo />
			</ThreeEnvironment>
		</div>
	);
}

export default App;
