import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import { useCart } from "@/context/CartContext";
import { fetchProducts } from "@/services/db";
import { Product } from "@/types/db";
import { toast } from "sonner";

type Filters = {
  search: string;
  length: string;
  color: string;
  texture: string;
  minPrice?: number;
  maxPrice?: number;
};

type ProductGridProps = {
  filters: Filters;
};

const ProductGrid = ({ filters }: ProductGridProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLengths, setSelectedLengths] = useState<Record<string, string>>({});
  const [visibleCount, setVisibleCount] = useState(15); // 5 per row × 3 rows
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});


  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => {
      const newState = { ...prev };

      products.forEach((product) => {
        if (product.image_urls && product.image_urls.length > 1) {
          const current = prev[product.id] || 0;
          newState[product.id] = (current + 1) % product.image_urls.length;
        }
      });

      return newState;
    });
  }, 3000); // change every 3 seconds

  return () => clearInterval(interval);
}, [products]);


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(value);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLength =
      !filters.length ||
      (product.lengths &&
        product.lengths.some((len) =>
          len.toLowerCase().includes(filters.length.toLowerCase())
        ));
    const matchesColor =
      !filters.color ||
      (product.colors &&
        product.colors.some((c) =>
          c.toLowerCase().includes(filters.color.toLowerCase())
        ));
    const matchesTexture =
      !filters.texture ||
      (product.textures &&
        product.textures.toLowerCase().includes(filters.texture.toLowerCase()));
    const matchesMinPrice = !filters.minPrice || product.price >= filters.minPrice;
    const matchesMaxPrice = !filters.maxPrice || product.price <= filters.maxPrice;

    return (
      matchesSearch &&
      matchesLength &&
      matchesColor &&
      matchesTexture &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const productsPerPage = 15;
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleViewMore = () => {
    if (visibleCount < filteredProducts.length) {
      setVisibleCount((prev) => prev + productsPerPage);
    } else {
      setVisibleCount(productsPerPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <section id="products" className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No products found matching your filters.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16 animate-fade-in-up">
          <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary hover:bg-primary/20 text-xs sm:text-sm px-3 py-1">
            Premium Collection
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-luxury font-bold mb-3 sm:mb-4 md:mb-6 text-foreground">
            Our <span className="text-gradient-gold">Hair Collection</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-elegant px-4">
            Discover our premium selection of 100% human hair extensions. Each
            bundle is carefully selected for quality and beauty.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {visibleProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-md bg-card transition-all duration-300 hover:scale-[1.02] rounded-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
                <div
                  className="relative overflow-hidden bg-gray-50"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden relative">
                    <img
                        src={
                          product.image_urls?.length
                            ? product.image_urls[currentImageIndex[product.id]] || product.image_url
                            : product.image_url || "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out"
                        onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                      />
                  </div>

                  {/* Stock Overlay */}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <Badge variant="secondary" className="text-xs font-bold px-3 py-1.5">
                        Out of Stock
                      </Badge>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.previous_price && product.previous_price > product.price && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                        SAVE {Math.round(((product.previous_price - product.price) / product.previous_price) * 100)}%
                      </div>
                    </div>
                  )}

                  {/* Favorite */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/95 hover:bg-white h-7 w-7 rounded-full shadow-sm"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 transition-all ${
                        favorites.includes(product.id)
                          ? "text-red-500 fill-red-500 scale-110"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>
              {/* Card Content */}
              <CardContent className="p-3">
                <h3 className="font-elegant font-bold text-sm mb-1 text-card-foreground line-clamp-2 min-h-[2.3rem]">
                  {product.name}
                </h3>

                {/* Length Selector */}
                {product.length_prices && product.length_prices.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-[11px] font-semibold text-gray-700 mb-1">
                      Select Length:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {product.length_prices.map((lp: any) => {
                        const len = lp.length;
                        const isSelected = selectedLengths[product.id] === len;
                        return (
                          <button
                            key={len}
                            onClick={() =>
                              setSelectedLengths((prev) => ({
                                ...prev,
                                [product.id]: len,
                              }))
                            }
                            className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 border-amber-500 shadow-sm"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                              }`}
                          >
                            {len}"
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-base font-bold text-primary">
                    {formatCurrency(
                      product.length_prices?.find((lp: any) => lp.length === selectedLengths[product.id])?.price ||
                      product.length_prices?.[0]?.price ||
                      product.price
                    )}
                  </span>

                  {(() => {
                    const selectedLP = product.length_prices?.find(
                      (lp: any) => lp.length === selectedLengths[product.id]
                    );
                    if (selectedLP?.previous_price && selectedLP.previous_price > selectedLP.price) {
                      return (
                        <span className="text-xs text-muted-foreground line-through ml-1">
                          {formatCurrency(selectedLP.previous_price)}
                        </span>
                      );
                    }
                    return null;
                  })()}
                  {product.previous_price && product.previous_price > product.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(product.previous_price)}
                    </span>
                  )}
                </div>

                {/* Stock Warning */}
                {product.stock > 0 && product.stock <= 10 && (
                  <p className="text-[11px] text-orange-600 font-medium mb-2">
                    Only {product.stock} left!
                  </p>
                )}

                {/* Add to Cart */}
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold text-xs py-2.5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock <= 0}
                  onClick={() => {
                    if (product.lengths && product.lengths.length > 0 && !selectedLengths[product.id]) {
                      toast.error("Please select a length first", {
                        description: "Choose your preferred hair length before adding to cart.",
                        duration: 2500,
                      });
                      return;
                    }

                    const selectedLength = selectedLengths[product.id];
                    const selectedLP = product.length_prices?.find((lp: any) => lp.length === selectedLength);

                    addToCart({
                      id: product.id,
                      name: product.name,
                      image: product.image_url || "/placeholder.png",
                      price: selectedLP?.price || product.length_prices?.[0]?.price || 0,
                      quantity: 1,
                      length: selectedLength || "Default",
                    });
                    
                    toast.success("Added to cart! 🎉", {
                      description: `${product.name} (${selectedLengths[product.id] || "Default"}"${selectedLengths[product.id] ? "" : " length"})`,
                      duration: 2500,
                    });
                  }}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  {product.stock > 0 ? "Add" : "Out"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        {filteredProducts.length > productsPerPage && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={handleViewMore}
              variant="outline"
              className="px-6 py-3 text-sm font-semibold rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              {visibleCount < filteredProducts.length ? "View More" : "Show Less"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
