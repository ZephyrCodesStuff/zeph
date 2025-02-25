import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import * as THREE from "three";

export const LightShaft = () => {
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      // Subtle movement of the light
      lightRef.current.position.x = Math.sin(t * 0.1) * 0.5 + 5;
      lightRef.current.position.y = Math.cos(t * 0.1) * 0.5 + 5;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 0, 2]}
      angle={0.3}
      penumbra={1}
      intensity={0.5}
      color="#ffd0a8"
      castShadow
    />
  );
};
