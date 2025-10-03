import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Contact from "@/components/Contact";
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
  return (
    <div className="min-h-screen bg-background">
      <Header filters={filters} setFilters={setFilters} />
      <Hero />
      <ProductGrid filters={filters} />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
