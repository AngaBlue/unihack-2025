import ThreeEnvironment from "./ThreeEnvironment";
import Terrarium from "./Terrarium";
// import TerrariumTwo from "./TerrariumTwo"; so we can load more than one at a time 

function App() {
  return (
    <div>

      <ThreeEnvironment>
		<Terrarium />
	  </ThreeEnvironment>

    </div>
  );
}

export default App;
