import { useProducts } from "@/hooks/use-products";
import type { Category } from "@/types/categories";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const { data } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.status === "SUCCESS") {
      const categoryMap = new Map();

      data?.data?.forEach((c) => {
        if (categoryMap.has(c?.Category)) {
          categoryMap.get(c?.Category).count += 1;
        } else {
          categoryMap.set(c?.Category, {
            name: c?.Category,
            image: `https://app.mymazix.com/Uploads/${
              c?.CartImage?.split("/Uploads")[1]
            }`,
            count: 1,
          });
        }
      });

      const uniqueCategories = Array.from(categoryMap.values());
      setCategories(uniqueCategories);
    }
  }, [data]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5;

    const autoScroll = () => {
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        scrollAmount += scrollSpeed;
        container.scrollLeft = scrollAmount;
      }
    };

    const interval = setInterval(autoScroll, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="categories" className="py-20  bg-nature-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block dark:text-white dark-primary font-medium tracking-wider uppercase text-sm mb-3">
            Browse By
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Product Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of herbal products, carefully categorized
            to help you find exactly what your body needs.
          </p>
        </div>

        <div
          ref={carouselRef}
          className="flex max-w-full overflow-x-auto gap-6 no-scrollbar"
        >
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products/${category.name?.toLowerCase()}`}
              className="group cursor-pointer animate-fade-up shrink-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-500 group-hover:-translate-y-2">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    width={"300px"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-1 ">
                    {category.name}
                  </h3>
                  <span className="text-primary-foreground/80 text-sm">
                    {category.count} Products
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
