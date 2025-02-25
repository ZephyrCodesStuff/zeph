import { PiWarningDuotone } from "react-icons/pi";

export const OrientationWarning = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md border-b border-white/10
                    p-3 text-center text-white/90 text-sm z-50
                    md:hidden portrait:flex hidden m-4 rounded-md items-center justify-center">
      <p className="flex flex-col items-center justify-center gap-2">
        <span className="flex items-center gap-2 text-lg"><PiWarningDuotone className="inline-block" size={24} /> <b>Warning!</b></span>
        <span className="text-md">This website is best experienced in <b>landscape mode</b>. Please rotate your device or use a desktop computer.</span>
      </p>
    </div>
  );
}; 