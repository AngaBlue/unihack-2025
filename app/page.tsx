import Client from './client';
import Terrarium from './Terrarium';
import ThreeEnvironment from './ThreeEnvironment';

function App() {
	return (
		<div>
			<Client />
			<ThreeEnvironment>
				<Terrarium />
			</ThreeEnvironment>
		</div>
	);
}

export default App;
