import SpeechModal from '@/components/SpeechModal';
import BackgroundWrapper from './BackgroundWrapper';
import ThreeEnvironment from './ThreeEnvironment';
function App() {
	return (
		<div>
			<SpeechModal />
			<BackgroundWrapper>
				<ThreeEnvironment />
			</BackgroundWrapper>
		</div>
	);
}

export default App;
