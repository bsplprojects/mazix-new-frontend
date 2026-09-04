import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/use-products";
import Logo from "@/assets/12.png";
import LanguageSelector from "./LanguageSelector";
import { ModeToggle } from "@/components/ModeToggle";
import type { Category } from "@/types/categories";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { totalItems, setIsCartOpen } = useCart();
  const { data } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (data?.status === "SUCCESS") {
      const categoryMap = new Map();

      data?.data?.forEach((c) => {
        if (categoryMap.has(c?.Category)) {
          categoryMap.get(c?.Category).count += 1;
        } else {
          categoryMap.set(c?.Category, {
            name: c?.Category,
            href: `/products/${c?.Category?.toLowerCase()}`,
          });
        }
      });

      const uniqueCategories = Array.from(categoryMap.values());
      setCategories(uniqueCategories);
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showScrolledStyle = isScrolled || !isHomePage;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products", hasSubmenu: true },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Orders", href: "/orders" },
    { label: "Login", href: "https://mymazix.com" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showScrolledStyle
          ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between ">
          <Link to="/" className="flex items-center gap-2 group">
            <div className=" overflow-hidden ">
              <img src={Logo} width={50} />
            </div>
            <span
              className={`text-2xl font-serif font-bold tracking-wide transition-colors duration-300 ${
                showScrolledStyle
                  ? "text-foreground"
                  : "text-primary-foreground"
              }`}
            >
              {/* Mazix */}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(
              (item) =>
                item.label !== "Login" && (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() =>
                      item.hasSubmenu && setIsProductMenuOpen(true)
                    }
                    onMouseLeave={() =>
                      item.hasSubmenu && setIsProductMenuOpen(false)
                    }
                  >
                    <Link
                      to={item.href}
                      className={`font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                        showScrolledStyle
                          ? "text-foreground/80 hover:text-primary"
                          : "text-primary-foreground/90 hover:text-primary-foreground"
                      }`}
                    >
                      {item.label}
                      {item.hasSubmenu && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isProductMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>

                    {item.hasSubmenu && isProductMenuOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-4xl">
                        <div className="bg-accent rounded-2xl shadow-elevated p-8 animate-fade-up border border-border">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent rotate-45 border-l border-t border-border" />

                          <div className="mb-6 pb-4 border-b border-border">
                            <h3 className="font-serif text-xl font-semibold text-accent-foreground">
                              Our Product Categories
                            </h3>
                            <p className="light:text-primary dark:text-white text-sm mt-1">
                              Explore our wide range of herbal products
                            </p>
                          </div>

                          <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                            {categories?.map((category) => (
                              <Link
                                key={category?.name}
                                to={category?.href || ""}
                                className="group flex items-center gap-2 text-accent-foreground/80 hover:text-secondary transition-colors duration-200"
                                onClick={() => setIsProductMenuOpen(false)}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary group-hover:scale-125 transition-all duration-200" />
                                <span className="font-medium text-sm uppercase tracking-wide">
                                  {category?.name}
                                </span>
                              </Link>
                            ))}
                          </div>

                          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                            <span className="light:text-primary dark:text-white text-sm">
                              Can't find what you're looking for?
                            </span>
                            <Link to="/products">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => setIsProductMenuOpen(false)}
                              >
                                View All Products
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector className="hidden sm:flex" />
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className={
                showScrolledStyle
                  ? "text-foreground"
                  : "text-primary-foreground"
              }
            ></Button>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${
                showScrolledStyle
                  ? "text-foreground"
                  : "text-primary-foreground"
              }`}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            </Button>

            {/* <Link to="/products">
              <Button
                variant={showScrolledStyle ? "default" : "heroOutline"}
                size="sm"
                className="hidden sm:flex"
              >
                Shop Now
              </Button>
            </Link> */}
            <Link to="/signin" target="_blank">
              <Button
                variant={showScrolledStyle ? "default" : "outline"}
                size="lg"
                className="hidden sm:flex"
              >
                Login
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden ${
                showScrolledStyle
                  ? "text-foreground"
                  : "text-primary-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 animate-fade-up">
            <div className="flex flex-col gap-2 bg-card rounded-xl p-4 shadow-card">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                        className="w-full flex items-center justify-between text-foreground/80 hover:text-primary font-medium py-2 px-3 rounded-lg hover:bg-muted transition-all"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isProductMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isProductMenuOpen && (
                        <div className="ml-4 mt-2 space-y-1 animate-fade-up">
                          {categories?.map((category) => (
                            <Link
                              key={category.name}
                              to={category.href || ""}
                              className="block text-muted-foreground hover:text-primary text-sm py-1.5 px-3 rounded hover:bg-muted/50 transition-all"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-foreground/80 hover:text-primary font-medium py-2 px-3 rounded-lg hover:bg-muted transition-all block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="default" className="mt-2 w-full">
                  Shop Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
