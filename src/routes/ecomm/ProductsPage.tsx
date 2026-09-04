import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  Star,
  Filter,
  Grid3X3,
  LayoutList,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/use-products";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Product } from "@/types/product";

const ProductsPage = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState("price-low");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const { data } = useProducts();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.pID,
      name: product.Product,
      price: product.MemberMRP,
      mrp: product.MRP,
      image: `https://app.mymazix.com/Uploads/${
        product?.Image?.split("/Uploads")[1]
      }`,
    });
  };

  const filteredProducts = (() => {
    if (!data?.data) return [];

    let products = search
      ? data.data.filter((p) =>
          p.Product.toLowerCase().includes(search.toLowerCase()),
        )
      : category
        ? data.data.filter(
            (p) => p.Category?.toLowerCase() === category.toLowerCase(),
          )
        : data.data;

    if (sortBy === "price-low") {
      products = [...products].sort((a, b) => a.MemberMRP - b.MemberMRP);
    } else if (sortBy === "price-high") {
      products = [...products].sort((a, b) => b.MemberMRP - a.MemberMRP);
    }

    return products;
  })();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="pt-32 pb-16 relative"
        style={{
          background:
            "linear-gradient(135deg, hsl(150 30% 35%) 0%, hsl(160 40% 25%) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[url('@/assets/hero-bg.jpg')] opacity-30 bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex  items-center gap-2 text-primary-foreground/70 text-sm mb-6">
            <Link
              to="/"
              className="hover:text-primary-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/products"
              className="hover:text-primary-foreground transition-colors"
            >
              Products
            </Link>
            {category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-primary-foreground">
                  {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
                </span>
              </>
            )}
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-4">
            {category?.charAt(0)?.toUpperCase() + category?.slice(1) ||
              "All Products"}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Explore our complete range of premium herbal products
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="text-foreground font-medium">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={"outline-none border-none"}
                />

                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-background shadow-sm text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-background shadow-sm text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-background">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts?.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredProducts.map((product: Product, index: number) => (
                <div
                  key={product.pID}
                  className={`group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 animate-fade-up ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-48 shrink-0" : "aspect-square"
                    }`}
                  >
                    <img
                      src={`https://app.mymazix.com/Uploads/${
                        product?.Image?.split("/Uploads")[1]
                      }`}
                      loading="lazy"
                      alt={product?.Product}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {product?.MemberMRP < product?.MRP && (
                      <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                        {Math.round(
                          (1 - product?.MemberMRP / product?.MRP) * 100,
                        )}
                        % OFF
                      </span>
                    )}

                    <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-secondary transition-all opacity-0 group-hover:opacity-100">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  <div
                    className={`p-5 flex flex-col ${
                      viewMode === "list" ? "flex-1" : ""
                    }`}
                  >
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {product?.Category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {product?.Product}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(4)
                                ? "text-secondary fill-secondary"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">(0)</span>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          MRP:
                        </span>
                        <span className="text-muted-foreground line-through text-sm">
                          ₹{product?.MRP}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Price:
                        </span>
                        <span className="text-xl font-bold text-primary">
                          ₹{product?.MemberMRP}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 gap-2"
                        disabled={product?.Status !== "Active"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Link to={`/product/${product.pID}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                No products found in this category.
              </p>
              <Link to="/products">
                <Button variant="default">View All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
