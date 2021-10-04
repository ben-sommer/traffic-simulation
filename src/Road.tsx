function Road(props: any) {
  const points = props.road.points;
  const divisionSize = props.divisionSize;

  const sortedX = points.map((x: any) => x[0]).sort((a: any, b: any) => a - b);
  const x = sortedX[1] + 1;
  const w = sortedX[1] - sortedX[0] + 1;

  const sortedY = points.map((x: any) => x[1]).sort((a: any, b: any) => a - b);
  const y = sortedY[1] + 1;
  const h = sortedY[1] - sortedY[0] + 1;

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
        <meshStandardMaterial color={0x252a30} />
      </mesh>
    </group>
  );
}

export default Road;
