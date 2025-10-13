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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-card hover-lift bg-card animate-scale-in transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden bg-gray-50">
                {/* Product Image */}
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Stock Status Overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Badge variant="secondary" className="text-sm sm:text-base lg:text-lg font-bold px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}

                {/* Discount Badge */}
                {product.previous_price && product.previous_price > product.price && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-lg shadow-lg">
                      SAVE {Math.round(((product.previous_price - product.price) / product.previous_price) * 100)}%
                    </div>
                  </div>
                )}

                {/* Heart Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/95 hover:bg-white h-9 w-9 sm:h-10 sm:w-10 rounded-full shadow-md transition-all z-10"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-all ${
                      favorites.includes(product.id)
                        ? "text-red-500 fill-red-500 scale-110"
                        : "text-gray-600"
                    }`}
                  />
                </Button>
              </div>

              <CardContent className="p-4 sm:p-5 lg:p-6">
                {/* Product Name */}
                <h3 className="font-elegant font-bold text-base sm:text-lg lg:text-xl mb-2 text-card-foreground line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>

                {/* Length Selector */}
                {product.lengths && product.lengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Select Length:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.lengths.map((len) => {
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
                            className={`
                              px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold 
                              border-2 transition-all duration-200 min-w-[3rem] sm:min-w-[3.5rem]
                              ${
                                isSelected
                                  ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 border-amber-500 shadow-md scale-105"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                              }
                            `}
                          >
                            {len}"
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price Section */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.previous_price && product.previous_price > product.price && (
                    <span className="text-sm sm:text-base text-muted-foreground line-through">
                      {formatCurrency(product.previous_price)}
                    </span>
                  )}
                </div>

                {/* Stock Indicator */}
                {product.stock > 0 && product.stock <= 10 && (
                  <p className="text-xs sm:text-sm text-orange-600 font-medium mb-3">
                    Only {product.stock} left in stock!
                  </p>
                )}

                {/* Add to Cart Button */}
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold text-sm sm:text-base py-5 sm:py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock <= 0}
                  onClick={() => {
                    if (product.lengths && product.lengths.length > 0 && !selectedLengths[product.id]) {
                      toast.error("Please select a length first", {
                        description: "Choose your preferred hair length before adding to cart.",
                        duration: 2500,
                      });
                      return;
                    }

                    addToCart({
                      id: product.id,
                      name: product.name,
                      image: product.image_url || "/placeholder.png",
                      price: product.price,
                      quantity: 1,
                      length: selectedLengths[product.id] || "Default",
                    });

                    toast.success("Added to cart! 🎉", {
                      description: `${product.name} (${selectedLengths[product.id] || "Default"}"${selectedLengths[product.id] ? '' : ' length'})`,
                      duration: 2500,
                    });
                  }}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;