function Floor(props: any) {
  const size = props.size || 6;
  const divisions = props.divisions || 40;

  return (
    <>
      <mesh {...props}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={0xd1d1d1} />
      </mesh>
      <gridHelper rotation={[Math.PI / 2, 0, 0]} args={[size, divisions]} />
    </>
  );
}

export default Floor;
