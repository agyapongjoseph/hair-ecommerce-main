
import { Star } from "lucide-react";

interface StickyDiscountBannerProps {
  isMenuOpen: boolean;
}

const StickyDiscountBanner = ({ isMenuOpen }: StickyDiscountBannerProps) => {
  // Hide the banner when menu is open
  if (isMenuOpen) return null;

  return (
    <div
      className="
        fixed 
        left-0 
        top-[64px] sm:top-[80px] 
        w-full 
        bg-yellow-500/25 
        backdrop-blur-sm 
        border-t border-b border-yellow-400/40
        text-center 
        py-2 sm:py-3 
        z-[999] 
        animate-slide-down
      "
    >
      <div className="flex items-center justify-center space-x-2">
        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 animate-spin-slow" />
        <span className="text-yellow-500 font-elegant font-semibold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight whitespace-nowrap">
          Clearance Sales Ongoing — Get Up To 40%–50% OFF
        </span>
        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 animate-spin-slow" />
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slide-down {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StickyDiscountBanner;
