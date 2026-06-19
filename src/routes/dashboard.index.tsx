import { Link } from "react-router-dom";
import { Wallet, Coins, ArrowRight, GitBranch, Loader2 } from "lucide-react";

import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { member } from "@/lib/mock-data";
import { useDashboard } from "@/hooks/useDashboard";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardHome() {
  const mid = sessionStorage.getItem("MID");
  const memberId = sessionStorage.getItem("memberID");
  const { memberDetail } = useDashboard(mid as string);

  const { data: memberDashboard, isLoading } = useQuery({
    queryKey: ["member-dashboard", memberId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/member/dashboard?MemberID=${memberId}`,
      );
      return res.data;
    },
  });

  const { data: memberRewards } = useQuery({
    queryKey: ["member-reward", memberId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/reward/${memberId}`);
      return res.data;
    },
  });

  const d = memberDashboard?.data;
  const m = memberDetail?.data;
  const r = memberRewards?.data;

  console.log(r);

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-8 max-w-400 mx-auto">
      <PageHeader
        title={`Welcome, ${m?.MemberName?.split(" ")[0] ?? "Member"}.`}
        subtitle={`${member.rank} · Member since ${member.joined} · Sponsor: ${member.sponsor}`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Wallet Amount"
          value={d?.CurrentWallet ?? 0}
          tone="emerald"
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Current Repurchase Amount"
          value={d?.CurrentRepWallet ?? 0}
          tone="brass"
          icon={<Coins className="h-4 w-4" />}
        />
        <StatCard
          label="Voucher Amount"
          value={d?.Voucher ?? 0}
          tone="emerald"
          icon={<Coins className="h-4 w-4" />}
        />
        <StatCard
          label="Matching"
          value={d?.Total ?? 0}
          tone="brass"
          icon={<Coins className="h-4 w-4" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Binary BV */}
        <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-xl">Binary BV</h2>
            <GitBranch className="h-4 w-4 text-brass" />
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Current pairing cycle
          </p>

          <div className="space-y-5">
            <LegBar
              label="Left Leg"
              value={Number(d?.LeftBV ?? 0)}
              max={500000}
              tone="emerald"
            />
            <LegBar
              label="Right Leg"
              value={Number(d?.RightBV ?? 0)}
              max={500000}
              tone="brass"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Reward Name</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Pair</TableHead>
              <TableHead>Achieved Pair</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {r?.length > 0 ? (
              r?.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>

                  <TableCell className="font-medium">
                    {row.RewardName}
                  </TableCell>

                  <TableCell>{row.Reward}</TableCell>

                  <TableCell>{row.RequiredPV}</TableCell>

                  <TableCell>{row.AchivePV}</TableCell>

                  <TableCell>
                    {Number(row.AchiveBV)?.toLocaleString() ?? 0}
                  </TableCell>

                  <TableCell>{row.Target?.toLocaleString() ?? 0}</TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1  text-xs rounded-full font-medium ${
                        row.Status === "Achieved"
                          ? "bg-green-100/10 text-green-500"
                          : "bg-yellow-100/10 text-yellow-500"
                      }`}
                    >
                      {row.Status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No rewards found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function LegBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "emerald" | "brass";
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">
          {value.toLocaleString("en-IN")} BV
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${tone === "emerald" ? "bg-gradient-emerald" : "bg-gradient-brass"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
