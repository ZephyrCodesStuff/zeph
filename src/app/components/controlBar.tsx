import { MdHome, MdZoomIn, MdZoomOut } from "react-icons/md";

export const ControlBar = ({
  onOverviewClick,
  onZoomIn,
  onZoomOut,
}: {
  onOverviewClick: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) => {
  return (
    <div className="fixed bottom-32 md:bottom-0 left-0 right-0 flex justify-center items-center p-4 z-20">
      <div
        className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-full 
                      flex gap-4 items-center border border-white/10"
      >
        <button
          onClick={onOverviewClick}
          className="text-white/80 hover:text-white transition-colors"
          title="Back to Overview"
        >
          <MdHome size={24} />
        </button>
        <div className="w-px h-6 bg-white/20" /> {/* Divider */}
        <button
          onClick={onZoomIn}
          className="text-white/80 hover:text-white transition-colors"
          title="Zoom In"
        >
          <MdZoomIn size={24} />
        </button>
        <button
          onClick={onZoomOut}
          className="text-white/80 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <MdZoomOut size={24} />
        </button>
      </div>
    </div>
  );
};
