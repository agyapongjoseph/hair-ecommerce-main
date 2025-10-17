import { useState } from "react";
import Header from "@/components/Header";
import StickyDiscountBanner from "@/components/StickyDiscountBanner";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Contact from "@/components/Contact";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";

type Filters = {
  search: string;
  length: string;
  color: string;
  texture: string;
  minPrice?: number;
  maxPrice?: number;
};

const Index = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
  // ✅ Define menu state here so both Header and Banner can access it
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        filters={filters}
        setFilters={setFilters}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Sticky Banner (below header, disappears when menu opens) */}
      <StickyDiscountBanner isMenuOpen={isMenuOpen} />

      {/* Page Content */}
      <Hero />
      <ProductGrid filters={filters} />
      <Contact />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Index;
