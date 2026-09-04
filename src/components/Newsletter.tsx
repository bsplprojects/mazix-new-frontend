import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Logo from "@/assets/logo_m.png";

const Newsletter = () => {
  const [email, setEmail] = useState("");


  return (
    <section className="py-20 bg-hero-gradient relative overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary-foreground/5 animate-float blur-2xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-primary-foreground/5 animate-float-delayed blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex  rounded-full  mb-6 animate-fade-up">
            <img src={Logo} className="h-16 w-16 text-primary-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-4 animate-fade-up delay-100">
            Join Our Wellness Journey
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 animate-fade-up delay-200">
            Subscribe to receive exclusive offers, wellness tips, and be the
            first to know about new products.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-up delay-300"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-xl focus:border-primary-foreground"
              required
            />
            <Button
              type="submit"
              className="sm:w-auto"
            >
              Subscribe
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-primary-foreground/60 text-sm mt-4 animate-fade-up delay-400">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
