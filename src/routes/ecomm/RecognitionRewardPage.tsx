import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Medal, // Bronze
  BadgeCheck, // Silver
  Star, // Star
  Stars, // Double Star  ✅ replaces StarHalf
  Gem, // Platinum
  Target, // Director
  Diamond, // Sapphire
  Sparkle, // Diamond
  Crown, // Crown
  Sparkles, // Crown Diamond
  ShieldCheck, // Ambassador
  ShieldPlus, // Crown Ambassador  ✅ replaces ShieldStar
  Swords, // Prince
  Trophy, // Crown Prince
  Flame, // King Of Mazix  ✅ replaces FlameKindling
} from "lucide-react";

const RecognitionRewardPage = () => {
  const ranks = [
    {
      rank: "Bronze",
      pair: 1000,
      income: "₹2,500",
      bonus: "₹1,000",
      icon: Medal,
    },
    {
      rank: "Silver",
      pair: 3000,
      income: "₹7,500",
      bonus: "₹3,000",
      icon: BadgeCheck,
    },
    {
      rank: "Star",
      pair: 8000,
      income: "₹20,000",
      bonus: "₹6,000",
      icon: Star,
    },
    {
      rank: "Double Star",
      pair: 16000,
      income: "₹40,000",
      bonus: "₹10,000",
      icon: Stars,
    },
    {
      rank: "Platinum",
      pair: 36000,
      income: "₹90,000",
      bonus: "₹20,000",
      icon: Gem,
    },
    {
      rank: "Director",
      pair: 72000,
      income: "₹1,90,000",
      bonus: "₹40,000",
      icon: Target,
    },
    {
      rank: "Sapphire",
      pair: 176000,
      income: "₹4,40,000",
      bonus: "₹80,000",
      icon: Diamond,
    },
    {
      rank: "Diamond",
      pair: 476000,
      income: "₹11,90,000",
      bonus: "₹2,00,000",
      icon: Sparkle,
    },
    {
      rank: "Crown",
      pair: 1276000,
      income: "₹31,90,000",
      bonus: "₹4,00,000",
      icon: Crown,
    },
    {
      rank: "Crown Diamond",
      pair: 2876000,
      income: "₹71,90,000",
      bonus: "₹8,00,000",
      icon: Sparkles,
    },
    {
      rank: "Ambassador",
      pair: 5876000,
      income: "₹1,46,90,000",
      bonus: "₹20,00,000",
      icon: ShieldCheck,
    },
    {
      rank: "Crown Ambassador",
      pair: 10000000,
      income: "₹2,50,00,000",
      bonus: "₹40,00,000",
      icon: ShieldPlus,
    },
    {
      rank: "Prince",
      pair: 15000000,
      income: "₹3,75,00,000",
      bonus: "₹80,00,000",
      icon: Swords,
    },
    {
      rank: "Crown Prince",
      pair: 20000000,
      income: "₹5,00,00,000",
      bonus: "₹1,00,00,000",
      icon: Trophy,
    },
    {
      rank: "King Of Mazix",
      pair: 30000000,
      income: "₹7,50,00,000",
      bonus: "₹2,00,00,000",
      icon: Flame,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              Recognition & Reward
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our recognition program rewards your hard work and dedication with
              ranks, bonuses, and special privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ranks.map((item, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border text-center hover:shadow-lg transition-shadow"
              >
                <item.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.rank}</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  PV Required: {item.pair}
                </p>
                <p className="text-primary font-bold text-lg">{item.bonus}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-accent/30 p-8 rounded-xl">
            <h2 className="text-2xl font-serif font-bold mb-4">
              Additional Benefits
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Travel incentives and international trips</li>
              <li>• Car and house fund bonuses</li>
              <li>• Special recognition at company events</li>
              <li>• Leadership training and development programs</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RecognitionRewardPage;
