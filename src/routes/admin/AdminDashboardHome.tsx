import { Link } from "react-router-dom";
import {
  Users,
  Wallet,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  Package,
} from "lucide-react";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";

export default function AdminDashboardHome() {
  const { data } = useQuery({
    queryKey: ["admin-header"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/header`);
      return res.data;
    },
  });

  const { data: chart } = useQuery({
    queryKey: ["admin-chart"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/charts`);
      return res.data;
    },
  });

  const d = data?.data;
  const c = chart;

  return (
    <div className="space-y-7">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero shadow-elegant p-6 lg:p-8">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-brass/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[3px] text-primary">
              <ShieldCheck className="h-4 w-4" />
              Admin Control Panel
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              Welcome Back, Admin 👋
            </h1>

            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Monitor members, income, payouts, reports and overall system
              activity from a single dashboard.
            </p>
          </div>

          {/* Right */}
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-gradient-emerald text-primary-foreground shadow-glow transition-all hover:scale-[1.03]"
          >
            <Link to="/admin/all-users">
              Manage Members
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <AdminCard
          title="Total Members"
          value={d?.maxMember.toLocaleString("en-IN")}
          icon={<Users className="h-5 w-5" />}
        />

        <AdminCard
          title="Active Members"
          value={d?.activeMember.toLocaleString("en-IN")}
          icon={<Users className="h-5 w-5" />}
        />

        <AdminCard
          title="Total Payout"
          value={d?.totalPayout.toLocaleString("en-IN")}
          icon={<IndianRupee className="h-5 w-5" />}
        />

        <AdminCard
          title="Total Transfer"
          value={d?.TotalTransfer.toLocaleString("en-IN")}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Current Month Members
          </h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={c?.barChart || []}>
                <XAxis
                  dataKey="day"
                  stroke="currentColor"
                  className="text-muted-foreground"
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground"
                />
                <Bar
                  dataKey="members"
                  fill="var(--primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Package Distribution
          </h2>

          <div style={{ width: "100%", height: 300 }}>
            {c?.pieChart?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={c?.pieChart || []}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {(c?.pieChart || []).map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          [
                            "var(--primary)",
                            "var(--brass)",
                            "var(--chart-3)",
                            "var(--chart-4)",
                            "var(--chart-5)",
                          ][index % 5]
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full grid place-items-center">
                <p className="text-sm text-muted-foreground flex flex-col gap-1 items-center">
                  <Package className="w-20 h-20 text-primary rotate-y-slow" />
                  No data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function AdminCard({ title, value, growth, icon }: any) {
  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-5 hover:bg-card transition-all duration-300 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">{title}</div>

        <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="text-3xl font-bold text-foreground">{value}</div>

      <div className="text-xs text-success mt-2">{growth}</div>
    </div>
  );
}
