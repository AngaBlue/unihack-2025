import ThreeEnvironment from "./ThreeEnvironment";
import Terrarium from "./Terrarium";
import TerrariumTwo from "./TerrariumTwo";

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
