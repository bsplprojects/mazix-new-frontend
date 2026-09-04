import { Helmet } from "react-helmet";
import {
  Leaf,
  Award,
  Heart,
  Truck,
  Users,
  Globe,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const values = [
  {
    icon: Users,
    title: "Customer First",
    description:
      "We prioritize our customers' health and satisfaction above everything else.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description:
      "Committed to eco-friendly practices and sustainable sourcing.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Striving for perfection in every product we create.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Blending ancient wisdom with modern research.",
  },
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Mazix Herbal</title>
        <meta
          name="description"
          content="Learn about Mazix Herbal's mission to bring pure, natural herbal products to every home. Discover our story, values, and commitment to quality."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block text-secondary font-medium tracking-wider uppercase text-sm mb-3">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Nurturing Wellness
              <span className="block text-foreground/50">Through Nature</span>
            </h1>
            <p className="light:text-primary dark:text-white text-lg max-w-2xl mx-auto">
              Bringing the purest herbal products to every home since 2015
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  At Mazix, we believe in the ancient wisdom of Ayurveda
                  combined with modern science. Our journey began with a simple
                  mission: to bring the purest herbal products to every home,
                  helping families embrace a healthier, more natural lifestyle.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Each product in our collection is carefully crafted using
                  time-tested recipes and the finest organic ingredients. We
                  work directly with farmers and local communities to ensure
                  sustainable practices and fair trade.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, Mazix has grown into a trusted name in herbal wellness,
                  serving thousands of customers across India with products that
                  nurture both body and soul.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
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
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-warm-gradient">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                  50+
                </div>
                <div className="text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                  10K+
                </div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                  100%
                </div>
                <div className="text-muted-foreground">Natural</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                  5★
                </div>
                <div className="text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className="p-4 rounded-full bg-secondary/10 w-fit mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Join Our Wellness Journey
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Experience the power of nature with our premium herbal products.
            </p>
            <Button variant="secondary" size="lg">
              Shop Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
