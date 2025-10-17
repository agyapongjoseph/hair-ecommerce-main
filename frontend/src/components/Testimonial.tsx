import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      "Excellent service and very professional. I’ve received so many compliments on my new look!",
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
      "Affordable prices and excellent quality. I’ll definitely be buying again!",
  },
];

const Testimonial = () => {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleViewMore = () => {
    setVisibleCount((prev) =>
      prev + 3 >= testimonials.length ? testimonials.length : prev + 3
    );
  };

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

        {/* Cards */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 justify-items-center mb-12">
          {testimonials.slice(0, visibleCount).map((t, index) => (
            <Card
              key={t.id}
              className="max-w-sm w-full bg-black border border-yellow-600 shadow-lg hover:shadow-yellow-600/30 transition-all duration-300 rounded-3xl hover:-translate-y-2 group"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <CardContent className="p-8 relative">
                {/* Decorative quote */}
                <div className="absolute top-4 left-4 text-6xl text-yellow-900 font-Poppins leading-none opacity-20">
                  "
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-200 mb-6 text-base leading-relaxed relative z-10">
                  {t.feedback}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <h4 className="font-semibold text-yellow-400 text-lg">
                    {t.name}
                  </h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        {visibleCount < testimonials.length && (
          <Button
            onClick={handleViewMore}
            className="px-8 py-6 text-black bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 rounded-full shadow-lg hover:shadow-yellow-500/50 text-base font-semibold"
          >
            View More Testimonials
          </Button>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonial;
