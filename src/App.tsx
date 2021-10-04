import "./App.css";
import { Canvas } from "@react-three/fiber";
import Floor from "./Floor";

function App() {
  return (
    <div className="App">
      <div className="w-full h-screen">
        <Canvas className="w-full">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Floor size={4} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
