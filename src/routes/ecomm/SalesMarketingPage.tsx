import { Helmet } from "react-helmet";

import { TrendingUp, Users, Award, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SalesMarketingPage = () => {
  const strategies = [
    {
      icon: TrendingUp,
      title: "Direct Selling Model",
      description:
        "Our direct selling model allows distributors to earn income through product sales and team building.",
    },
    {
      icon: Users,
      title: "Team Building",
      description:
        "Build your network of distributors and earn bonuses based on team performance and sales volume.",
    },
    {
      icon: Award,
      title: "Performance Bonuses",
      description:
        "Earn additional bonuses based on your sales performance and achievement of targets.",
    },
    {
      icon: Target,
      title: "Point Value System",
      description:
        "Accumulate Point Value (PV) through sales to unlock higher ranks and better commission rates.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sales & Marketing Strategy | Mazix</title>
        <meta
          name="description"
          content="Discover Mazix's Sales & Marketing Strategy. Learn about our direct selling model and earning opportunities."
        />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              Sales & Marketing Strategy
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive sales and marketing plan provides distributors
              with multiple income streams and growth opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border border-border"
              >
                <strategy.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{strategy.title}</h3>
                <p className="text-muted-foreground">{strategy.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-accent/30 p-8 rounded-xl">
            <h2 className="text-2xl font-serif font-bold mb-4">
              Income Opportunities
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Retail Profit: Earn profit on direct product sales</li>
              <li>
                • Performance Bonus: Based on personal and team PV accumulation
              </li>
              <li>
                • Leadership Bonus: Rewards for developing new leaders in your
                team
              </li>
              <li>
                • Recognition Rewards: Special bonuses for achieving rank
                milestones
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SalesMarketingPage;
