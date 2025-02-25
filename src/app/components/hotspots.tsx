import { Html } from "@react-three/drei";

export type Hotspot = {
  id: string;
  position: [number, number, number];
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
};

export const hotspots: Hotspot[] = [
  {
    id: 'education',
    position: [-3.5, 1.5, 0.1],
    cameraPosition: [-3, 1.5, 1.5],
    lookAt: [-3, 1.6, 0],
  },
  {
    id: 'projects',
    position: [-0.8, -0.6, 0.1],
    cameraPosition: [-1, -0.8, 1.5],
    lookAt: [-1, -0.7, 0],
  },
  {
    id: 'bio',
    position: [2, 1, 0.1],
    cameraPosition: [2, 1, 1.5],
    lookAt: [2, 1, 0],
  },
  {
    id: 'experience',
    position: [4, 0, 0.1],
    cameraPosition: [4, 0, 1.5],
    lookAt: [4, 0, 0],
  }
];

export const Hotspots = ({ 
  onHotspotClick, 
  selectedHotspot 
}: { 
  onHotspotClick: (hotspot: Hotspot) => void;
  selectedHotspot: Hotspot | null;
}) => {
  const baseRotation = -0.1;

  return (
    <>
      {hotspots.map((hotspot) => (
        <group 
          key={hotspot.id} 
          position={[hotspot.position[0], hotspot.position[1], 0.2]}
          rotation={[0, 0, baseRotation]}
        >
          <Html
            center
            transform
            style={{
              transform: 'translate3d(-50%, -50%, 0)',
              scale: 3,
              pointerEvents: 'auto',
            }}
            zIndexRange={[20, 0]}
            distanceFactor={0.5}
          >
            <button 
              onClick={() => onHotspotClick(hotspot)}
              className={`w-8 h-8 rounded-full transition-all duration-300 cursor-pointer
                       flex items-center justify-center
                       bg-black/60 backdrop-blur-sm
                       ring-2 ring-white/40 ring-offset-2 ring-offset-black/50
                       hover:ring-white/60 hover:bg-black/70 hover:opacity-100 ${selectedHotspot?.id === hotspot.id ? 'opacity-25' : 'opacity-100'}`}
              style={{
                transform: `scale(${selectedHotspot?.id === hotspot.id ? 1.2 : 1})`
              }}
            >
              <div className="relative">
                <div className={`absolute inset-0 w-3 h-3 rounded-full bg-sky-400/50 
                              animate-ping ${selectedHotspot?.id === hotspot.id ? 'opacity-100' : 'opacity-0'}`} />
                <div className="w-3 h-3 rounded-full bg-sky-400 shadow-lg shadow-sky-500/50" />
              </div>
            </button>
          </Html>
        </group>
      ))}
    </>
  );
};