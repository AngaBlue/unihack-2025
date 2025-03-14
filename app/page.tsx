import ThreeEnvironment from "./ThreeEnvironment";
import BackgroundWrapper from "./BackgroundWrapper";
import SpeechPopup from "@/components/SpeechPopup";
function App() {
  return (
    <div>

		<SpeechPopup/>
		<BackgroundWrapper>
      <ThreeEnvironment />
		</BackgroundWrapper>
    </div>
  );
}

export default App;