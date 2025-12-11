import { Star } from "lucide-react";

interface StickyDiscountBannerProps {
  isMenuOpen: boolean;
}

const StickyDiscountBanner = ({ isMenuOpen }: StickyDiscountBannerProps) => {
  // Hide the banner when menu is open
  if (isMenuOpen) return null;

  const bannerText = [
    "Christmas Sales Ongoing — Get Up To 40%–50% OFF",

    "Center Point Mall",

    "Local Pickup Options",

    "Worldwide Shipping",

    "Express Delivery Available"

  ];

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
        overflow-hidden
      "
    >
      <div className="flex items-center justify-center space-x-2">
        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 animate-spin-slow flex-shrink-0" />
        
        <div className="relative overflow-hidden w-full">
          <div className="flex animate-scroll whitespace-nowrap">
            {[...bannerText, ...bannerText].map((text, i) => (
              <span
                key={i}
                className="text-yellow-500 font-elegant font-semibold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight mx-10"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 animate-spin-slow flex-shrink-0" />
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slide-down {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 12s linear infinite;
          display: inline-flex;
        }
      `}</style>
    </div>
  );
};

export default StickyDiscountBanner;