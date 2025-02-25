import { FaGithub, FaEnvelope, FaGlobe } from "react-icons/fa";

export const SocialBar = () => {
  return (
    <div className="fixed bottom-0 right-0 flex justify-center items-center p-4 z-20 w-full mx-auto md:w-auto">
      <div
        className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-full 
                  flex gap-4 items-center border border-white/10"
      >
        <a
          href="https://github.com/ZephyrCodesStuff"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors"
          title="GitHub Profile"
        >
          <FaGithub size={24} />
        </a>
        <div className="w-px h-6 bg-white/20" /> {/* Divider */}
        <a
          href="mailto:work@zephs.me"
          className="text-white/80 hover:text-white transition-colors"
          title="Email Contact"
        >
          <FaEnvelope size={24} />
        </a>
        <div className="w-px h-6 bg-white/20" /> {/* Divider */}
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors"
          title="Blog"
        >
          <FaGlobe size={24} />
        </a>
      </div>
    </div>
  );
}; 