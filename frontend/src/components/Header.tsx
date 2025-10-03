import { useState } from "react";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
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
  ;

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
      search: filters.search || undefined,
      length: filters.length || undefined,
      color: filters.color || undefined,
      texture: filters.texture || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    });
    setShowSearch(false); // close dropdown after applying
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(value);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-card relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 animate-fade-in-up">
            <img
              src={logoPlaceholder}
              alt="Farida Abdul Hair Logo"
              className="h-8 md:h-10 w-auto"
            />
            <span className="text-xl md:text-2xl font-luxury font-bold text-gradient-gold">
              Farida Abdul Hair
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm md:text-base text-foreground hover-gold font-elegant font-medium transition-all duration-300"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {/* Toggle Search Dropdown */}
            <Button
              variant="ghost"
              size="sm"
              className="hover-gold"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Dropdown Panel */}
            {showSearch && (
              <div className="absolute top-12 right-0 w-72 bg-card border border-border rounded-lg shadow-lg p-4 space-y-3 animate-fade-in-up z-50">
                {/* Search Input */}
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters}
                />
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={applyFilters}
                >
                  Search
                </Button>

                {/* Filters */}
                <select
                  className="w-full border rounded px-2 py-1"
                  value={filters.length}
                  onChange={(e) => setFilters({ ...filters, length: e.target.value })}
                >
                  <option value="">Length</option>
                  <option value="10">10”</option>
                  <option value="12">12”</option>
                  <option value="14">14”</option>
                  <option value="16">16”</option>
                </select>

                <select
                  className="w-full border rounded px-2 py-1"
                  value={filters.color}
                  onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                >
                  <option value="">Color</option>
                  <option value="Natural Black">Natural Black</option>
                  <option value="Brown">Brown</option>
                  <option value="Blonde">Blonde</option>
                </select>

                <select
                  className="w-full border rounded px-2 py-1"
                  value={filters.texture}
                  onChange={(e) => setFilters({ ...filters, texture: e.target.value })}
                >
                  <option value="">Texture</option>
                  <option value="Straight">Straight</option>
                  <option value="Curly">Curly</option>
                  <option value="Wavy">Wavy</option>
                </select>

                {/* Price Range */}
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min ₵"
                    className="w-1/2 border rounded px-2 py-1"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: Number( e.target.value) || undefined})
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max ₵"
                    className="w-1/2 border rounded px-2 py-1"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: Number( e.target.value) || undefined})
                    }
                  />
                </div>

                <Button size="sm" className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            )}

            <UserMenu />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover-gold relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <h3 className="font-bold mb-3">My Cart</h3>
                {cart.length === 0 ? (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                            >
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between font-bold text-sm">
                      <span>Total:</span>
                      <span>
                        {formatCurrency(
                          cart.reduce(
                            (sum, item) =>
                              sum + item.price * item.quantity,
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
          <div className="md:hidden">
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
      {isMenuOpen && (
  <div className="md:hidden bg-background border-t border-border shadow-lg animate-fade-in-down">
    <nav className="px-4 py-4 space-y-4">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="block text-base font-medium text-foreground hover-gold font-elegant transition-all duration-300"
          onClick={() => setIsMenuOpen(false)} // close menu on click
        >
          {item.name}
        </a>
      ))}

      {/* Mobile Search */}
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => {
            applyFilters();
            setIsMenuOpen(false);
          }}
        >
          Search
        </Button>
      </div>

      {/* Mobile Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="hover-gold">
          <UserMenu />
        </Button>
       <div className="w-full bg-card border border-border rounded-lg p-3 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm">My Cart</h3>
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="text-xs font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ₵{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">
                    ₵{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ✅ Cart Total + Checkout */}
          {cart.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Total:</span>
                <span>
                  ₵
                  {cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
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
