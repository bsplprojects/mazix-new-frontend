import About from "@/components/About";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen bg-background ">
      <Header />
      <main>
        <Hero/>
        <Categories />
        <Products />
        <About />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
