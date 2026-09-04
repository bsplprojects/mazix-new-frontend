import { Star, Quote } from "lucide-react";

const testimonials = [
  { id: 1, name: "Priya Sharma", role: "Yoga Instructor", content: "Mazix products have transformed my wellness routine. The quality is exceptional, and I love knowing that everything is 100% natural. Highly recommend!", rating: 5, avatar: "PS" },
  { id: 2, name: "Rahul Verma", role: "Fitness Enthusiast", content: "The Ashwagandha capsules have been a game-changer for my energy levels. Great products with visible results. Will definitely be ordering more!", rating: 5, avatar: "RV" },
  { id: 3, name: "Anita Patel", role: "Home Maker", content: "Finally found a brand I can trust for my family. The herbal honey and spices are of premium quality. Fast delivery and excellent packaging too!", rating: 5, avatar: "AP" },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-secondary font-medium tracking-wider uppercase text-sm mb-3">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Don't just take our word for it. Here's what our valued customers have to say about their experience with Mazix.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-500 relative animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="absolute -top-4 right-8"><div className="p-3 rounded-full bg-primary shadow-soft"><Quote className="h-5 w-5 text-primary-foreground" /></div></div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-1 mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 text-secondary fill-secondary" />))}</div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><span className="font-serif font-bold text-primary">{testimonial.avatar}</span></div>
                <div><h4 className="font-semibold text-foreground">{testimonial.name}</h4><span className="text-sm text-muted-foreground">{testimonial.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
