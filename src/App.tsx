import "./App.css";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import Floor from "./Floor";
import { Suspense, useEffect, useRef, useState, useContext } from "react";
import { roads, junctions, generateGraph } from "./roads";
import Road from "./Road";
import Junction from "./Junction";
import Context from "./context/Context";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const state = useContext(Context);

  const controls: any = useRef();

  useFrame((state) => {
    if ((state as any).enableControls) controls.current.update();
  });

  camera.up.set(0, 0, 1);

  return (
    // @ts-ignore
    <orbitControls
      minPolarAngle={-Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      ref={controls}
      args={[camera, domElement]}
      enabled={state.enableControls}
    />
  );
}

function RouteCamera(props: any) {
  const divisionSize = props.divisionSize;

  const { camera } = useThree();

  const { route: joinedRoute, setEnableControls } = useContext(Context);

  const route =
    joinedRoute?.map((x) => x.split(",").map((x: any) => parseInt(x))) || null;

  const wait = async (ms: number) =>
    new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });

  const flyRoute = async (route: any) => {
    setEnableControls(false);

    const routeRoads = joinedRoute
      .slice(0, -1)
      .map((x: any, i: any) => [x, joinedRoute[i + 1]]);

    for (var i = 0; i < routeRoads.length; i++) {
      // for (var i = 0; i < 1; i++) {
      const points = routeRoads[i].map((x: any) =>
        x.split(",").map((x: any) => parseInt(x))
      );

      const sortedX = points
        .map((x: any) => x[0])
        .sort((a: any, b: any) => a - b);

      const x = sortedX[1] + 1;
      const w = sortedX[1] - sortedX[0] + 1;

      const sortedY = points
        .map((x: any) => x[1])
        .sort((a: any, b: any) => a - b);
      const y = sortedY[1] + 1;
      const h = sortedY[1] - sortedY[0] + 1;

      const isVertical = h > w;
      const isPointingUp = points[0][1] < points[1][1];
      const isPointingRight = points[0][0] < points[1][0];

      const deg45 = Math.PI / 4;
      const deg90 = deg45 * 2;

      camera.position.set(divisionSize * (x - 1), divisionSize * (y - 1), 2);

      // const xRot = 0;
      // const yRot = 0;
      const xRot = isVertical ? (isPointingUp ? deg45 : -deg45) : 0;
      const yRot = isVertical ? 0 : isPointingRight ? -deg45 : deg45;
      const zRot = isVertical
        ? isPointingUp
          ? 0
          : 2
        : isPointingRight
        ? 1
        : 3;

      const back = 3;

      const xOff = isVertical ? 0 : isPointingRight ? 1 - w - back : 1 + back;
      const yOff = isVertical ? (isPointingUp ? 1 - h - back : 1 + back) : 0;
      const zOff = 1;

      console.log({ isVertical, isPointingUp, isPointingRight, x, y });

      camera.rotation.set(xRot, yRot, -deg90 * zRot);
      camera.position.set(
        divisionSize * (x - 1 + xOff),
        divisionSize * (y - 1 + yOff),
        zOff
      );

      await wait(1000);
    }
  };

  useEffect(() => {
    console.log({ route });
    if (route) {
      flyRoute(route);
    } else {
      setEnableControls(true);
    }
  }, [route?.map((x: any) => x.join(",")).join(",")]);

  return null;
}

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

  const route = getRoute(graph);

  const [enableControls, setEnableControls] = useState(true);

  return (
    <div className="App">
      <div className="w-full h-screen">
        <Canvas className="w-full">
          <Suspense fallback={null}>
            <Context.Provider
              value={{
                roads,
                junctions,
                selected,
                junctionClick,
                route,
                graph,
                setEnableControls,
                enableControls,
              }}
            >
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Floor size={size} divisions={divisions} />

              <RouteCamera divisionSize={divisionSize} />
              <CameraControls />

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
