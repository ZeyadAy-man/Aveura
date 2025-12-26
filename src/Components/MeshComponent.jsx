import { memo } from "react";

const MeshComponent = memo(({ geometry, material, onClick, onPointerOver, onPointerOut, ...props }) => (
  <mesh 
    geometry={geometry} 
    material={material} 
    onClick={onClick}
    onPointerOver={onPointerOver}
    onPointerOut={onPointerOut}
    {...props} 
  />
));

export default MeshComponent;