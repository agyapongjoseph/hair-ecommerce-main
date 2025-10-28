import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

// ✅ Testimonial data (Array, not function)
const testimonials = [
  {
    id: 1,
    name: "Ama Boateng",
    feedback:
      "Farida Abdul Hair gave me the best experience! The hair quality is amazing and long-lasting.",
  },
  {
    id: 2,
    name: "Nana Adjei",
    feedback:
      "Excellent service and very professional. I've received so many compliments on my new look!",
  },
  {
    id: 3,
    name: "Abigail Mensah",
    feedback:
      "I love my hair! It feels so natural, and the delivery was super fast. Highly recommend!",
  },
  {
    id: 4,
    name: "Sarah Ofori",
    feedback:
      "The best place to get high-quality wigs in Ghana. Great communication and quick delivery!",
  },
  {
    id: 5,
    name: "Linda Owusu",
    feedback:
      "Affordable prices and excellent quality. I'll definitely be buying again!",
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="testimonial"
      className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
    >
      {/* Background decorative lights */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600 rounded-full blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Heading */}
        <div className="mb-12 space-y-3">
          <p className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-400">
            What Our Customers Say
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Hear directly from our satisfied customers
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto mb-8">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((t, index) => (
                <div
                  key={t.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <Card className="max-w-2xl mx-auto bg-black border border-yellow-600 shadow-lg hover:shadow-yellow-600/30 transition-all duration-300 rounded-3xl">
                    <CardContent className="p-8 md:p-12 relative">
                      {/* Decorative quote */}
                      <div className="absolute top-4 left-4 text-6xl md:text-8xl text-yellow-900 font-Poppins leading-none opacity-20">
                        "
                      </div>

                      {/* Stars */}
                      <div className="flex justify-center gap-1 mb-6 relative z-10">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-6 h-6 fill-yellow-400"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-200 mb-8 text-lg md:text-xl leading-relaxed relative z-10">
                        {t.feedback}
                      </p>

                      <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xl">
                          {t.name.charAt(0)}
                        </div>
                        <h4 className="font-semibold text-yellow-400 text-xl">
                          {t.name}
                        </h4>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-yellow-400 w-8"
                    : "bg-yellow-600/30 hover:bg-yellow-600/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;