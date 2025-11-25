import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import heroimage from "@/assets/hero-image.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroimage}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-black opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          {/* Discount Badge */}

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-luxury font-bold mb-6 text-white leading-tight mt-14">
            Premium
            <span className="block text-gradient-gold animate-shimmer bg-gradient-to-r from-primary via-primary-glow to-primary bg-[length:200%_100%]">
              Human Hair
            </span>
            Units
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-elegant leading-relaxed">
            100% Raw Donor Hair • Premium Quality • Natural Beauty
            <br />
            Transform your look with our luxury hair collection
          </p>

          {/* Features */}
          <div className="flex justify-center mb-10">
            <ul className="list-disc text-white flex gap-8">
              {["No Shedding", "Long Lasting"].map((feature, index) => (
                <li
                  key={feature}
                  className="font-elegant animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Shop Now → Scroll to Products */}
            <Button
              variant="outline"
              size="lg"
              className="border-white text-gray-500 hover:bg-white hover:text-black font-elegant font-bold px-8 py-6 text-lg hover-lift"
              onClick={() => {
                const el = document.getElementById("products");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Shop Now
            </Button>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { label: "Happy Customers", value: "10K+" },
              { label: "Premium Products", value: "50+" },
              { label: "Quality", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-luxury font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300 font-elegant">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
