import { Sparkles } from "@react-three/drei";

export const AtmosphericParticles = () => {
  return (
    <>
      {/* Closer, larger particles */}
      <Sparkles
        count={10000}
        scale={12}
        size={0.5}
        speed={0.2}
        opacity={1}
        color="#ffffff"
        position={[0, 0, 1]}
      />
    </>
  );
};
