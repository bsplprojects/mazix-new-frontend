import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Leaf } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Herbal products background"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 bg-hero-gradient opacity-90" />

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/50" />
      </div>

      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary-foreground/10 animate-float blur-xl" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-primary-foreground/5 animate-float-delayed blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-secondary/20 animate-float blur-lg" />

      <div className="relative z-10 container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 animate-fade-up border border-primary-foreground/20">
            <Sparkles className="h-4 w-4 dark:text-primary text-white" />
            <span className="dark:text-primary/90 text-white text-sm font-medium">
              100% Natural & Organic
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground dark:text-white leading-tight mb-6 animate-fade-up delay-100">
            Pure Herbal
            <span className="block mt-2 text-secondary dark:text-white">
              Wellness
            </span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 dark:text-white/80 max-w-2xl mx-auto mb-10 animate-fade-up delay-200 leading-relaxed">
            Discover the ancient wisdom of Ayurveda with our premium collection
            of herbal products. Nurture your body, mind, and soul naturally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Link to={"/products"}>
              <Button variant="default">
                Explore Products
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to={"/contact"}>
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto animate-fade-up delay-400">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
                <Leaf className="h-6 w-6 dark:text-primary text-white" />
              </div>
              <span className="dark:text-primary text-white text-sm font-medium">
                100% Organic
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
                <Shield className="h-6 w-6 dark:text-primary text-white" />
              </div>
              <span className="dark:text-primary text-white text-sm font-medium">
                Lab Tested
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
                <Sparkles className="h-6 w-6 dark:text-primary text-white" />
              </div>
              <span className="dark:text-primary text-white text-sm font-medium">
                Premium Quality
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
