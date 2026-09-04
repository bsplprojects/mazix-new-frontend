import { Leaf, Award, Heart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "All our products are made from pure, organic ingredients sourced directly from nature.",
  },
  {
    icon: Award,
    title: "Quality Certified",
    description:
      "Every product undergoes rigorous testing to ensure the highest quality standards.",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description:
      "We never test on animals and use only ethically sourced ingredients.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Free shipping across India with quick delivery to your doorstep.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-warm-gradient">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-right">
            <span className="inline-block text-secondary font-medium tracking-wider uppercase text-sm mb-3">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
              Nurturing Wellness
              <span className="block text-foreground">Through Nature</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              At Mazix, we believe in the ancient wisdom of Ayurveda combined
              with modern science. Our journey began with a simple mission: to
              bring the purest herbal products to every home, helping families
              embrace a healthier, more natural lifestyle.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Each product in our collection is carefully crafted using
              time-tested recipes and the finest organic ingredients. We work
              directly with farmers and local communities to ensure sustainable
              practices and fair trade.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg">
                Our Story
              </Button>
              <Button variant="outline" size="lg">
                Our Values
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border">
          <div className="text-center animate-fade-up">
            <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
              50+
            </div>
            <div className="text-muted-foreground">Products</div>
          </div>
          <div className="text-center animate-fade-up delay-100">
            <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
              10K+
            </div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center animate-fade-up delay-200">
            <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
              100%
            </div>
            <div className="text-muted-foreground">Natural</div>
          </div>
          <div className="text-center animate-fade-up delay-300">
            <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
              5★
            </div>
            <div className="text-muted-foreground">Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
