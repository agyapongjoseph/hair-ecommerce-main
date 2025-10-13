import { useState } from "react";
import { Menu, X, ShoppingBag, Search, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoPlaceholder from "@/assets/logo-placeholder.jpg";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import {useCart} from '@/context/CartContext';
import UserMenu from "./UserMenu";

type Filters = {
  search: string;
  length: string;
  color: string;
  texture: string;
  minPrice?: number;
  maxPrice?: number;
};

type HeaderProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const Header = ({ filters, setFilters }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {cart, cartCount, removeFromCart} = useCart();
  const navigate = useNavigate();

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const applyFilters = () => {
    setFilters({
      search: searchTerm || "",
      length: filters.length || "",
      color: filters.color || "",
      texture: filters.texture || "",
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    });
    setShowSearch(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      search: "",
      length: "",
      color: "",
      texture: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(value);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 animate-fade-in-up">
            <img
              src={logoPlaceholder}
              alt="Farida Abdul Hair Logo"
              className="h-8 md:h-10 w-auto"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-luxury font-bold text-gradient-gold whitespace-nowrap">
              Farida Abdul Hair
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm xl:text-base text-foreground hover-gold font-elegant font-medium transition-all duration-300"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 relative">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="hover-gold"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Search Dropdown */}
            {showSearch && (
              <div className="absolute top-12 right-0 w-80 xl:w-96 bg-card border border-border rounded-lg shadow-lg p-4 space-y-3 animate-fade-in-up z-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Search & Filter</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs h-auto py-1 px-2"
                  >
                    Reset
                  </Button>
                </div>

                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                  className="w-full"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={filters.length}
                    onChange={(e) => setFilters({ ...filters, length: e.target.value })}
                  >
                    <option value="">Length</option>
                    <option value="10">10"</option>
                    <option value="12">12"</option>
                    <option value="14">14"</option>
                    <option value="16">16"</option>
                  </select>

                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={filters.color}
                    onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                  >
                    <option value="">Color</option>
                    <option value="Natural Black">Natural Black</option>
                    <option value="Brown">Brown</option>
                    <option value="Blonde">Blonde</option>
                  </select>
                </div>

                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={filters.texture}
                  onChange={(e) => setFilters({ ...filters, texture: e.target.value })}
                >
                  <option value="">Texture</option>
                  <option value="Straight">Straight</option>
                  <option value="Curly">Curly</option>
                  <option value="Wavy">Wavy</option>
                </select>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min ₵"
                    className="w-1/2 border rounded px-3 py-2 text-sm"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: Number(e.target.value) || undefined})
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max ₵"
                    className="w-1/2 border rounded px-3 py-2 text-sm"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined})
                    }
                  />
                </div>

                <Button size="sm" className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            )}

            <UserMenu />

            {/* Cart Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover-gold relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 xl:w-96 p-4">
                <h3 className="font-bold mb-3">My Cart</h3>
                {cart.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 pb-3 border-b last:border-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.quantity} × {formatCurrency(item.price)}
                            </p>
                            <p className="text-sm font-bold mt-1">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center font-bold text-base pt-3 border-t">
                      <span>Total:</span>
                      <span>
                        {formatCurrency(
                          cart.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                        )}
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => navigate("/checkout")}
                    >
                      Go to Checkout
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover-gold"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-lg animate-fade-in-down max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="px-4 py-4 space-y-4">
            {/* Navigation Links */}
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-foreground hover-gold font-elegant transition-all duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            <div className="border-t pt-4 mt-4">
              {/* Mobile Search & Filters */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Search & Filter</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs h-auto py-1 px-2"
                  >
                    Reset
                  </Button>
                </div>

                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applyFilters();
                      setIsMenuOpen(false);
                    }
                  }}
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="w-full border rounded px-3 py-2 text-sm bg-background"
                    value={filters.length}
                    onChange={(e) => setFilters({ ...filters, length: e.target.value })}
                  >
                    <option value="">Length</option>
                    <option value="10">10"</option>
                    <option value="12">12"</option>
                    <option value="14">14"</option>
                    <option value="16">16"</option>
                  </select>

                  <select
                    className="w-full border rounded px-3 py-2 text-sm bg-background"
                    value={filters.color}
                    onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                  >
                    <option value="">Color</option>
                    <option value="Natural Black">Natural Black</option>
                    <option value="Brown">Brown</option>
                    <option value="Blonde">Blonde</option>
                  </select>
                </div>

                <select
                  className="w-full border rounded px-3 py-2 text-sm bg-background"
                  value={filters.texture}
                  onChange={(e) => setFilters({ ...filters, texture: e.target.value })}
                >
                  <option value="">Texture</option>
                  <option value="Straight">Straight</option>
                  <option value="Curly">Curly</option>
                  <option value="Wavy">Wavy</option>
                </select>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min ₵"
                    className="w-1/2 border rounded px-3 py-2 text-sm bg-background"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: Number(e.target.value) || undefined})
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max ₵"
                    className="w-1/2 border rounded px-3 py-2 text-sm bg-background"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined})
                    }
                  />
                </div>

                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    applyFilters();
                    setIsMenuOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>

              {/* User Menu */}
              <div className="mb-4 pb-4 border-b">
                <UserMenu />
              </div>

              {/* Mobile Cart */}
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">My Cart</h3>
                  {cartCount > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 font-semibold">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>

                {cart.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Your cart is empty.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 pb-3 border-b last:border-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.quantity} × {formatCurrency(item.price)}
                            </p>
                            <p className="text-sm font-bold mt-1">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center font-bold text-base pt-3 border-t">
                      <span>Total:</span>
                      <span>
                        {formatCurrency(
                          cart.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                        )}
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/checkout");
                      }}
                    >
                      Go to Checkout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;