import "./App.css";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import Floor from "./Floor";
import { Suspense, useRef, useState } from "react";
import { roads, junctions, generateGraph } from "./roads";
import Road from "./Road";
import Junction from "./Junction";
import Context from "./context/Context";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

function CameraControls () {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls: any = useRef();
  useFrame((state) => controls.current.update());

  camera.up.set(0, 0, 1);

  return (
    // @ts-ignore
    <orbitControls
      minPolarAngle={-Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      ref={controls}
      args={[camera, domElement]}
    />
  );
};

function App() {
  const size = 7;
  const divisions = 40;

  const divisionSize = size / divisions;

  const [selected, setSelected] = useState<number[][]>([]);

  const coordsEqual = (a: number[], b: number[]) =>
    a[0] === b[0] && a[1] === b[1];

  const junctionClick = (coords: number[]) => {
    if (selected.length === 0) {
      setSelected([coords]);
    } else if (selected.length === 1) {
      if (!coordsEqual(coords, selected[0])) {
        setSelected([selected[0], coords]);
      }
    } else {
      setSelected([coords]);
    }
  };

  const graph = generateGraph(roads, junctions);

  const getRoute = (graph: any) => {
    if (selected.length !== 2) return null;

    try {
      return graph.shortestPath(selected[0].join(","), selected[1].join(","));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="App">
      <div className="w-full h-screen">
        <Canvas className="w-full">
          <CameraControls />
          <Suspense fallback={null}>
            <Context.Provider
              value={{
                roads,
                junctions,
                selected,
                junctionClick,
                route: getRoute(graph),
                graph,
              }}
            >
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Floor size={size} divisions={divisions} />

              {roads.map((road, index) => (
                <Road road={road} key={index} divisionSize={divisionSize} />
              ))}

              {junctions.map((junction, index) => (
                <Junction
                  junction={junction}
                  key={index}
                  divisionSize={divisionSize}
                />
              ))}
            </Context.Provider>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default App;
