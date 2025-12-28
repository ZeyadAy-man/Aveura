import { memo } from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
const TransmissionMesh = memo(({ geometry, transmissionProps, onClick, onPointerOver, onPointerOut, ...props }) => (
  <mesh 
    geometry={geometry} 
    onClick={onClick}
    onPointerOver={onPointerOver}
    onPointerOut={onPointerOut}
    {...props}
  >
    <MeshTransmissionMaterial {...transmissionProps} />
  </mesh>
));

export default TransmissionMesh;