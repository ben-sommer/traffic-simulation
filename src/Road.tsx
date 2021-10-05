import { useLoader } from "@react-three/fiber";
import { useContext, useMemo } from "react";
import { RepeatWrapping } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Context from "./context/Context";

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

  const state = useContext(Context);

  const routeRoads = state.route
    ? state.route.slice(0, -1).map((x, i) => [x, state.route[i + 1]].join(","))
    : null;

  const routeSection = routeRoads
    ? routeRoads.find(
        (x) =>
          x === points.map((x: any) => x.join(",")).join(",") ||
          x ===
            points
              .map((x: any) => x.join(","))
              .reverse()
              .join(",")
      ) || null
    : null;

  const routeSectionInts = routeSection
    ? [
        [routeSection?.split(",")[0], routeSection?.split(",")[1]],
        [routeSection?.split(",")[2], routeSection?.split(",")[3]],
      ].map((x: any) => x.map((x: any) => parseInt(x)))
    : null;

  const isRoutePointingUp = routeSectionInts
    ? routeSectionInts[0][1] < routeSectionInts[1][1]
    : null;
  const isRoutePointingRight = routeSectionInts
    ? routeSectionInts[0][0] < routeSectionInts[1][0]
    : null;

  const chevron = oneWay
    ? isVertical
      ? isPointingUp
        ? routeSection
          ? "up-blue"
          : "up"
        : routeSection
        ? "down-blue"
        : "down"
      : isPointingRight
      ? routeSection
        ? "right-blue"
        : "right"
      : routeSection
      ? "left-blue"
      : "left"
    : isVertical
    ? routeSection
      ? isRoutePointingUp
        ? "vertical-blue-up"
        : "vertical-blue-down"
      : "vertical"
    : routeSection
    ? isRoutePointingRight
      ? "horizontal-blue-right"
      : "horizontal-blue-left"
    : "horizontal";

  const cachedTexture = useLoader(TextureLoader, `/img/chevron-${chevron}.png`);

  const texture = useMemo(() => {
    const clone = cachedTexture.clone();
    clone.needsUpdate = true;
    return clone;
  }, [cachedTexture]);

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
          0.036,
        ]}
      >
        <boxGeometry args={[w * divisionSize, h * divisionSize, 0.05]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh
        position={[
          (x - w / 2 - 1 / 2) * divisionSize,
          (y - h / 2 - 1 / 2) * divisionSize,
          0.035,
        ]}
      >
        <boxGeometry
          args={[w * divisionSize + 0.01, h * divisionSize + 0.01, 0.051]}
        />
        <meshStandardMaterial color={0x888888} />
      </mesh>
    </group>
  );
}

export default Road;
