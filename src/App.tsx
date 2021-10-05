import "./App.css";
import { Canvas } from "@react-three/fiber";
import Floor from "./Floor";
import { Suspense } from "react";

function App() {
  return (
    <div className="App">
      <div className="w-full h-screen">
        <Canvas className="w-full">
          <Suspense fallback={null}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Floor size={4} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default App;
