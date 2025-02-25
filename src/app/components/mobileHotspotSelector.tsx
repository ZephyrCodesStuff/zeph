import { Hotspot } from "./hotspots";
import { FaGraduationCap, FaCode, FaUser, FaBriefcase } from "react-icons/fa";

const getHotspotIcon = (id: string) => {
  switch (id) {
    case 'education':
      return <FaGraduationCap size={20} />;
    case 'projects':
      return <FaCode size={20} />;
    case 'bio':
      return <FaUser size={20} />;
    case 'experience':
      return <FaBriefcase size={20} />;
    default:
      return null;
  }
};

export const MobileHotspotSelector = ({
  hotspots,
  selectedHotspot,
  onHotspotClick,
}: {
  hotspots: Hotspot[];
  selectedHotspot: Hotspot | null;
  onHotspotClick: (hotspot: Hotspot) => void;
}) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 flex justify-center items-center p-4 z-10">
      <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full 
                    flex gap-3 items-center border border-white/10
                    overflow-x-auto max-w-full no-scrollbar">
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={() => onHotspotClick(hotspot)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all
                     whitespace-nowrap
                     ${selectedHotspot?.id === hotspot.id 
                       ? 'bg-white/20 text-white' 
                       : 'text-white/80 hover:text-white'}`}
          >
            <span className="text-lg">
              {getHotspotIcon(hotspot.id)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}; 