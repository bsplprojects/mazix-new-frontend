import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Shield,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mazix — Premium MLM Member Network" },
      {
        name: "description",
        content:
          "Binary MLM platform with purchase, repurchase, rewards and real-time genealogy for ambitious distributors.",
      },
      { property: "og:title", content: "Mazix — Premium MLM Member Network" },
      {
        property: "og:description",
        content:
          "Binary MLM platform with purchase, repurchase, rewards and real-time genealogy.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background ambience */}
      <div className="pointer-events-none fixed inset-0 bg-radial-emerald opacity-60" />
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />

      <div className="relative">
        {/* Nav */}
        <header className="px-6 lg:px-12 py-6 flex items-center justify-between">
          <BrandMark />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#plan" className="hover:text-foreground transition-smooth">
              Plan
            </a>
            <a
              href="#rewards"
              className="hover:text-foreground transition-smooth"
            >
              Rewards
            </a>
            <a
              href="#features"
              className="hover:text-foreground transition-smooth"
            >
              Features
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
            >
              <Link to="/signup">
                Join Network <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="px-6 lg:px-12 pt-12 pb-24 max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground mb-8">
            <Sparkles className="h-3 w-3 text-brass" />
            Binary plan · Real-time genealogy · Instant payouts
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] max-w-5xl">
            Build a legacy on a{" "}
            <span className="text-gradient-emerald italic">balanced</span>{" "}
            binary network.
          </h1>

          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Mazix is the executive-grade member dashboard for serious
            distributors — track purchase, repurchase, binary BV, ranks and
            rewards from one calm, data-rich command center.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-7 bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
            >
              <Link to="/dashboard">
                Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 border-border bg-card/50"
            >
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>

          {/* Stat strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden shadow-elegant">
            {[
              { v: "₹482Cr+", l: "Payouts to date" },
              { v: "1.2L+", l: "Active members" },
              { v: "62", l: "Countries" },
              { v: "99.98%", l: "On-time payouts" },
            ].map((s) => (
              <div key={s.l} className="bg-card p-6">
                <div className="font-display text-3xl text-gradient-brass">
                  {s.v}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="px-6 lg:px-12 py-24 max-w-7xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GitBranch,
                title: "Binary Genealogy",
                desc: "Visualize your left & right legs with live BV, rank tags and active status.",
              },
              {
                icon: TrendingUp,
                title: "Purchase + Repurchase",
                desc: "One-tap product orders that keep your monthly BV qualification intact.",
              },
              {
                icon: Award,
                title: "7-Tier Reward Ladder",
                desc: "From Silver cash bonus to Royal Crown — track progress to every milestone.",
              },
              {
                icon: Users,
                title: "Team Performance",
                desc: "Drill into any downline member's volume, rank velocity and contribution.",
              },
              {
                icon: Shield,
                title: "Secure Wallet",
                desc: "Every binary, sponsor and reward credit recorded on a tamper-evident ledger.",
              },
              {
                icon: Sparkles,
                title: "Rank Advancement",
                desc: "Animated rank progress with the exact BV pair you need to hit next.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-gradient-card p-7 shadow-card border border-border/50 transition-smooth hover:border-primary/40 hover:shadow-glow"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-smooth group-hover:bg-gradient-emerald group-hover:shadow-glow">
                  <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero border border-border p-12 md:p-16 shadow-elegant">
            <div className="absolute inset-0 bg-radial-emerald opacity-60" />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl max-w-2xl leading-tight">
                Your downline is growing.{" "}
                <span className="text-gradient-brass italic">
                  Lead it like a CEO.
                </span>
              </h2>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-7 bg-gradient-brass text-brass-foreground shadow-brass hover:opacity-90"
                >
                  <Link to="/signup">
                    Start Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 bg-card/40 border-border"
                >
                  <Link to="/signin">Member Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="px-6 lg:px-12 py-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <BrandMark size={28} />
          <div>
            © {new Date().getFullYear()} Mazix Wealth Network. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
