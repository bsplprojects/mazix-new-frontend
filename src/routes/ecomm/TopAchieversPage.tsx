import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Trophy, Star } from "lucide-react";

const TopAchieversPage = () => {
  const achievers = [
    { name: "Rajesh Kumar", rank: "Crown Prince", location: "Delhi" },
    { name: "Priya Sharma", rank: "Crown", location: "Mumbai" },
    { name: "Amit Patel", rank: "Royal Diamond", location: "Gujarat" },
    { name: "Sunita Devi", rank: "Royal Diamond", location: "Bihar" },
    { name: "Vikram Singh", rank: "Diamond", location: "Rajasthan" },
    { name: "Anita Roy", rank: "Diamond", location: "West Bengal" },
    { name: "Suresh Yadav", rank: "Diamond", location: "Jharkhand" },
    { name: "Meena Kumari", rank: "Platinum", location: "Ranchi" },
    { name: "Rakesh Gupta", rank: "Platinum", location: "Patna" },
    { name: "Kavita Singh", rank: "Platinum", location: "Lucknow" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              Top 10 Achievers
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Celebrating our top performers who have achieved remarkable
              success through dedication and hard work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievers.map((achiever, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border flex items-center gap-4"
              >
                <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{achiever.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {achiever.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {achiever.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TopAchieversPage;
