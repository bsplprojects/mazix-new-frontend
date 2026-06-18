import { Link } from "react-router-dom";
import { BrandMark } from "@/components/brand-mark";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex relative w-1/2 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-radial-emerald opacity-70" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/">
            <BrandMark />
          </Link>
          <div className="space-y-6 max-w-md">
            <div className="text-xs uppercase tracking-[0.3em] text-brass">
              Member Portal
            </div>
            <h2 className="font-display text-5xl leading-[1.05]">
              Manage your{" "}
              <span className="italic text-gradient-emerald">network</span>,
              rewards and payouts.
            </h2>
            <div className="flex gap-6 pt-4 border-t border-border/40">
              <div>
                <div className="font-display text-2xl text-gradient-brass">
                  ₹12.8L
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg. Diamond earnings
                </div>
              </div>
              <div>
                <div className="font-display text-2xl text-gradient-brass">
                  99.98%
                </div>
                <div className="text-xs text-muted-foreground">
                  Payout reliability
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            "Mazix turned my downline chaos into a clear roadmap to Crown rank."
            — Priya S., Platinum
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <BrandMark />
            </Link>
          </div>
          <h1 className="font-display text-4xl mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{subtitle}</p>
          {children}
          <div className="mt-8 text-sm text-muted-foreground text-center">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
