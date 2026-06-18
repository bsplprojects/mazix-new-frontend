import { Link } from "react-router-dom";
import {
  Users,
  Wallet,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
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
      <div className="rounded-3xl border border-white/10 bg-linear-to-br from-yellow-500/10 via-black to-zinc-900 p-6 lg:p-8 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-52 w-52 bg-yellow-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 text-xs tracking-[3px] uppercase mb-3">
              <ShieldCheck className="h-4 w-4" />
              Admin Control Panel
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Welcome Back, Admin 👋
            </h1>

            <p className="text-zinc-400 mt-2 text-sm">
              Monitor members, income, payouts & system activity.
            </p>
          </div>

          <Button
            asChild
            className="h-11 px-6 rounded-xl bg-linear-to-r from-yellow-400 to-yellow-600 text-black font-semibold hover:opacity-90"
          >
            <Link to="/admin/users">
              Manage Members
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ================= STATS ================= */}

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
       
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl p-6">
          
          <h2 className="text-xl font-semibold text-white mb-4">
            Current Month Members
          </h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={c?.barChart || []}>
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="members" fill="#DF9C00" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Package Distribution
          </h2>

          <div style={{ width: "100%", height: 300 }}>
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
                    <Cell key={index} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   SMALL COMPONENTS
========================================= */

function AdminCard({ title, value, growth, icon }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl p-5 hover:bg-white/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-zinc-400">{title}</div>

        <div className="h-11 w-11 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="text-3xl font-bold text-white">{value}</div>

      <div className="text-xs text-green-400 mt-2">{growth}</div>
    </div>
  );
}
