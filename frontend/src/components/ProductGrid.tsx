import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import { useCart } from "@/context/CartContext";
import { fetchProducts } from "@/services/db";
import { Product } from "@/types/db";

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

  // ✅ FIX: use lengths, colors, textures (not length, color, texture)
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

  if (loading) return <p className="text-center py-8">Loading products...</p>;

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary hover:bg-primary/20">
            Premium Collection
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-luxury font-bold mb-4 sm:mb-6 text-foreground">
            Our <span className="text-gradient-gold">Hair Collection</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Discover our premium selection of 100% human hair extensions. Each
            bundle is carefully selected for quality and beauty.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-card hover-lift bg-card animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                {/* Product Image */}
                <img
                  src={product.image_url || "/placeholder.png"}
                  alt={product.name}
                  className="w-full aspect-[4/4] object-contain bg-white rounded-md transition-transform duration-500 group-hover:scale-105"
                />

                {/* Stock Status */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-sm sm:text-lg font-bold">
                      Out of Stock
                    </Badge>
                  </div>
                )}

                {/* Discount Badge - Top Left like Jumia */}
                {product.previous_price && product.previous_price > product.price && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <div className="bg-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
                      -{Math.round(((product.previous_price - product.price) / product.previous_price) * 100)}%
                    </div>
                  </div>
                )}

                {/* Heart Icon */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 hover:bg-white h-8 w-8 p-0"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      favorites.includes(product.id)
                        ? "text-destructive fill-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>

              <CardContent className="p-4 sm:p-6">
                {/* Product Name */}
                <h3 className="font-elegant font-bold text-base sm:text-lg mb-1 sm:mb-2 text-card-foreground">
                  {product.name}
                </h3>

                {/* Lengths line */}
                <div className="text-sm text-muted-foreground mb-2">
                  {product.lengths && product.lengths.length > 0 ? product.lengths.join(", ") : "One size"}
                </div>

                
                {/* Price Section */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full sm:w-auto sm:min-w-[140px] bg-secondary text-secondary-foreground hover:bg-secondary/90 font-elegant font-bold group"
                  disabled={product.stock <= 0}
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      image: product.image_url || "/placeholder.png",
                      price: product.price,
                      quantity: 1,
                    })
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
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
