import { createFileRoute } from "@tanstack/react-router";
import { Wallet, ArrowDownToLine, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { recentTransactions, member } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/wallet")({
  component: WalletPage,
});

function WalletPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="E-Wallet"
        subtitle="Available balance, payouts and withdrawal history"
        action={
          <Button className="bg-gradient-brass text-brass-foreground shadow-brass hover:opacity-90">
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Request Withdrawal
          </Button>
        }
      />

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-gradient-hero border border-border/60 p-8 shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-emerald opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 text-brass">
              <Wallet className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Available Balance</span>
            </div>
            <div className="font-display text-5xl text-gradient-emerald mb-1">
              ₹{member.walletBalance.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-muted-foreground">
              Last credit: 2h ago · Binary bonus ₹8,400
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/40">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pending
                </div>
                <div className="font-display text-xl text-brass">
                  ₹{member.pendingPayout.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Lifetime
                </div>
                <div className="font-display text-xl">
                  ₹{member.lifetimeEarnings.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatCard
          label="This Month"
          value="₹38,400"
          delta="+18% vs last month"
          tone="emerald"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <StatCard
          label="Withdrawn"
          value="₹2,40,000"
          delta="6 withdrawals YTD"
          tone="brass"
          icon={<ArrowDownRight className="h-4 w-4" />}
        />
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border/60 shadow-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl">Transaction Ledger</h2>
          <div className="flex gap-2 text-xs">
            <button className="px-3 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/30">
              All
            </button>
            <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:bg-accent">
              Credits
            </button>
            <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:bg-accent">
              Withdrawals
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">Transaction</th>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-right px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-accent/30 transition-smooth">
                <td className="px-6 py-4 font-mono text-xs">{t.id}</td>
                <td className="px-6 py-4">{t.type}</td>
                <td className="px-6 py-4 text-muted-foreground">{t.date}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t.status}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-right font-display text-base ${t.amount > 0 ? "text-foreground" : "text-brass"}`}
                >
                  {t.amount > 0 ? "+" : ""}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
