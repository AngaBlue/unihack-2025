import Terrarium from './Terrarium';
import ThreeEnvironment from './ThreeEnvironment';
import Client from './client';

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
