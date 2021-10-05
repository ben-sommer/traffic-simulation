import { useLoader } from "@react-three/fiber";
import { useContext, useEffect, useState } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Context from "./context/Context";

function Junction(props: any) {
  const point = props.junction.split(",").map((x: any) => parseInt(x));

  const divisionSize = props.divisionSize;

  const x = point[0] + 1;
  const y = point[1] + 1;

  const texture = useLoader(TextureLoader, `/img/junction.png`);
  const textureHover = useLoader(TextureLoader, `/img/junction-hover.png`);
  const textureGreen = useLoader(TextureLoader, `/img/junction-green.png`);
  const textureRed = useLoader(TextureLoader, `/img/junction-red.png`);

  const [hover, setHover] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "auto";
  }, [hover]);

  const coordsEqual = (a: number[], b: number[]) =>
    a[0] === b[0] && a[1] === b[1];

  const state = useContext(Context);

  const map = hover
    ? textureHover
    : state &&
      state.selected.length > 0 &&
      coordsEqual(state.selected[0], point)
    ? textureGreen
    : state &&
      state.selected.length > 1 &&
      coordsEqual(state.selected[1], point)
    ? textureRed
    : texture;

  return (
    <group>
      <mesh
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        position={[(x - 1) * divisionSize, (y - 1) * divisionSize, 0.041]}
        onClick={() => state.junctionClick(point)}
      >
        <boxGeometry args={[divisionSize, divisionSize, 0.06]} />
        <meshStandardMaterial map={map} />
      </mesh>
      <mesh position={[(x - 1) * divisionSize, (y - 1) * divisionSize, 0.039]}>
        <boxGeometry args={[divisionSize + 0.04, divisionSize + 0.04, 0.061]} />
        <meshStandardMaterial color={0x666666} />
      </mesh>
    </group>
  );
}

export default Junction;
