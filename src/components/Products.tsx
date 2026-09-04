import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/types/product";
import { getProductImage } from "@/helpers/getProductImage";

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.pID,
      name: product.Product,
      price: product.MemberMRP || product.StockistMRP,
      mrp: product.MRP,
      image: `https://app.mymazix.com/Uploads/${
        product?.Image?.split("/Uploads")[1]
      }`,
    });
  };

  const { data } = useProducts();

  const shuffleArray = (array: Product[]) => {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };

  const shuffledProducts = shuffleArray(
    data?.data?.filter((p) => p.Status === "Active") || [],
  ).slice(0, 8);

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-secondary font-medium tracking-wider uppercase text-sm mb-3">
            Featured
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Best Selling Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our most loved products, trusted by thousands of customers for their
            quality and effectiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {shuffledProducts.map((product, index) => (
            <Link
              to={`/product/${product?.pID}`}
              key={product?.pID}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden aspect-4/5">
                <img
                  src={getProductImage(product?.Image)}
                  loading="lazy"
                  alt={product?.Product}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* {true && (
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === "Bestseller"
                        ? "bg-primary text-primary-foreground"
                        : product.badge === "New"
                        ? "bg-accent text-accent-foreground"
                        : product.badge === "Sale"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-terracotta text-primary-foreground"
                    }`}
                  >
                    {product.badge}
                  </span>
                )} */}

                <button className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-secondary transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <Button
                    variant="default"
                    className="w-full gap-2"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="p-5">
                <span className="text-sm text-muted-foreground">
                  {product?.Category}
                </span>
                <h3 className="font-serif text-xl font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                  {product?.Product}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(4)
                            ? "text-secondary fill-secondary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews || 0})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-foreground">
                    ₹{product?.MemberMRP}
                  </span>
                  {product?.MRP && (
                    <span className="text-muted-foreground line-through">
                      ₹{product?.MRP}
                    </span>
                  )}
                  {product?.MRP && (
                    <span className="text-secondary text-sm font-medium">
                      {Math.round(
                        (1 - product?.MemberMRP / product?.MRP) * 100,
                      )}
                      % OFF
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/products")}
            variant="outline"
            size="lg"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
