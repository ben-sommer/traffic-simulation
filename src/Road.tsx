import { useLoader } from "@react-three/fiber";
import { RepeatWrapping } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

function Road(props: any) {
  const points = props.road.points;
  const divisionSize = props.divisionSize;
  const oneWay = props.road.oneWay;

  const sortedX = points.map((x: any) => x[0]).sort((a: any, b: any) => a - b);
  const x = sortedX[1] + 1;
  const w = sortedX[1] - sortedX[0] + 1;

  const sortedY = points.map((x: any) => x[1]).sort((a: any, b: any) => a - b);
  const y = sortedY[1] + 1;
  const h = sortedY[1] - sortedY[0] + 1;

  const isVertical = h > w;
  const isPointingUp = points[0][1] < points[1][1];
  const isPointingRight = points[0][0] < points[1][0];

  const chevron = oneWay
    ? isVertical
      ? isPointingUp
        ? "up"
        : "down"
      : isPointingRight
      ? "right"
      : "left"
    : isVertical
    ? "vertical"
    : "horizontal";

  const texture = useLoader(TextureLoader, `/img/chevron-${chevron}.png`);

  if (texture) {
    if (h > w) {
      texture.repeat.set(1, h);
      texture.wrapT = RepeatWrapping;
    } else {
      texture.repeat.set(w, 1);
      texture.wrapS = RepeatWrapping;
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
