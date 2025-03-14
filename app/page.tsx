import SpeechModal from '@/components/SpeechModal';
import BackgroundWrapper from './BackgroundWrapper';
import ThreeEnvironment from './ThreeEnvironment';
function App() {
	return (
		<div>
			<SpeechModal text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora voluptates voluptatem porro rerum! Soluta error incidunt, minus obcaecati, laborum architecto ut sunt atque earum voluptatibus necessitatibus consequatur, aut expedita assumenda tempore excepturi quo! Earum officiis dolorum quam architecto, eveniet numquam amet nulla quia tempore possimus deserunt perferendis placeat repudiandae eos?" />
			<BackgroundWrapper>
				<ThreeEnvironment />
			</BackgroundWrapper>
		</div>
	);
}

export default App;
