import { useLoader } from "@react-three/fiber";
import { RepeatWrapping } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

function Road(props: any) {
  const points = props.road.points;
  const divisionSize = props.divisionSize;

  const sortedX = points.map((x: any) => x[0]).sort((a: any, b: any) => a - b);
  const x = sortedX[1] + 1;
  const w = sortedX[1] - sortedX[0] + 1;

  const sortedY = points.map((x: any) => x[1]).sort((a: any, b: any) => a - b);
  const y = sortedY[1] + 1;
  const h = sortedY[1] - sortedY[0] + 1;

  const texture = useLoader(
    TextureLoader,
    props.road.oneWay ? ((h > w) ? (points[0][1] > points[1][1] ? "down-chevron.png" : "up-chevron.png") : points[0][0] > points[1][0] ? "left-chevron.png" : "right-chevron.png") : h > w ? "vertical-two-way.png" : "horizontal-two-way.png"
  );

  if (texture) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    if (h > w) {
      texture.repeat.set(1, h);
    } else {
      texture.repeat.set(w, 1);
    }
    texture.anisotropy = 16;
  }

  return (
    <group>
      <mesh
        position={[
          (x - w / 2 - 1 / 2) * divisionSize,
          (y - h / 2 - 1 / 2) * divisionSize,
          0,
        ]}
      >
        <boxGeometry args={[w * divisionSize, h * divisionSize, 0.001]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

export default Road;
