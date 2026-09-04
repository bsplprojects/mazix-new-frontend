import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, IndianRupee, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { categoryData } from "@/data/products";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  const { data } = useProducts();
  const { toast } = useToast();

  const product = useMemo(() => {
    if (!data?.data) return null;

    return data.data.find((p) => String(p.pID) === String(id));
  }, [id, data]);
  console.log(id);

  useEffect(() => {
    const title = product
      ? `${product.Product} | Mazix`
      : "Product Not Found | Mazix";

    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        product
          ? `Buy ${product.name} at Mazix. Premium herbal products for natural wellness. Order online with fast delivery.`
          : "Product not found at Mazix. Browse our premium herbal products for natural wellness.",
      );
    }
  }, [product]);

  const productJsonLd = useMemo(() => {
    if (!product) return null;

    const categoryName = categoryData?.[product?.Category]?.name;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product?.Product,
      image: [product?.Image],
      description: categoryName
        ? `${product?.Product} (in ${categoryName}.`
        : `${product?.Product}.`,
      brand: {
        "@type": "Brand",
        name: "Mazix",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: String(product?.MemberMRP),
        availability:
          product?.Status === "Active"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(4),
        reviewCount: String(0),
      },
    };
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !product.Status === "Active") return;

    addToCart({
      id: product.pID,
      name: product.Product,
      price: product.MemberMRP,
      mrp: product.MRP,
      image: `https://app.mymazix.com/Uploads/${
        product?.Image?.split("/Uploads")[1]
      }`,
    });

    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28">
        <section className="container mx-auto px-4 py-10">
          <nav className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">
              {product ? product.Product : "Not Found"}
            </span>
          </nav>

          {!product ? (
            <article className="max-w-2xl mx-auto text-center py-16">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Product not found
              </h1>
              <p className="text-muted-foreground mt-3">
                This product doesn't exist anymore. Please browse our latest
                products.
              </p>
              <div className="mt-8">
                <Button asChild>
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            </article>
          ) : (
            <article className="grid gap-10 lg:grid-cols-2 items-start">
              <div className="bg-card rounded-2xl overflow-hidden shadow-card">
                <img
                  src={`https://app.mymazix.com/Uploads/${
                    product?.Image?.split("/Uploads")[1]
                  }`}
                  alt={`${product.Product} herbal product image`}
                  className="w-full h-full object-cover aspect-square"
                  loading="lazy"
                />
              </div>
              {/* <div className="flex items-center gap-4">
               
                <div className="bg-white p-3 rounded-lg shadow flex flex-col items-center">
                  
                  <p className="text-m font-semibold text-center mb-2">
                    {product.Product}
                  </p>

                  <QRCode
                    value={`https://mazix.co.in/product/${product.pID}`}
                    size={250}
                  />
                </div>
              </div> */}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  {product.Product}
                </h1>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-0.5">
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
                    {4} (0 reviews)
                  </span>
                </div>

                <p className="text-muted-foreground mt-4">
                  Category:{" "}
                  <span className="font-semibold">
                    {categoryData?.[product?.Category]?.name || "Herbal"}
                  </span>
                </p>

                <div className="mt-4 text-zinc-500">
                  <p className="whitespace-pre-wrap font-medium text-justify">
                    {product?.Description}
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary flex items-center">
                      <IndianRupee />
                      {product?.MemberMRP}
                    </span>
                    {product?.MRP > product?.MemberMRP && (
                      <span className="text-muted-foreground line-through text-lg flex items-center">
                        <IndianRupee size={15} />
                        {product?.MRP}
                      </span>
                    )}
                    {product?.MRP > product?.MemberMRP && (
                      <span className="text-secondary text-sm font-medium">
                        {Math.round(
                          (1 - product?.MemberMRP / product?.MRP) * 100,
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  {product?.Status !== "Active" && (
                    <span className="inline-flex text-sm font-semibold bg-destructive text-destructive-foreground px-3 py-1.5 rounded-lg">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default"
                    size="lg"
                    className="gap-2"
                    onClick={handleAddToCart}
                    disabled={!product.Status === "Active"}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" size="lg" asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </article>
          )}
        </section>

        {productJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
