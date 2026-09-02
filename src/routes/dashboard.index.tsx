import { Wallet, Coins, Loader2 } from "lucide-react";

import { PageHeader, StatCard } from "@/components/dashboard-ui";
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
import * as joiningApi from "@/services/joiningApi";
import OfferPopup from "@/components/OfferPopup";

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

  const { data: dash } = useQuery({
    queryKey: ["dashboard", memberId, mid],
    queryFn: async () => {
      const res = await joiningApi.getMemberDashboard(
        mid as string,
        memberId as string,
      );

      return res;
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

  if (isLoading)
    return (
      <div className="w-full flex items-start justify-center gap-2 ">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8 max-w-400 mx-auto">
      <PageHeader
        title={`Welcome, ${m?.MemberName?.split(" ")[0] ?? "Member"}.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Wallet Amount"
          value={dash?.CurrentWallet ?? 0}
          tone="emerald"
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Current Repurchase Amount"
          value={dash?.CurrentRepWallet ?? 0}
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
          label="Matching Amount"
          value={d?.Total ?? 0}
          tone="brass"
          icon={<Coins className="h-4 w-4" />}
        />
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

      {/* OFFER POPUP */}
      <OfferPopup />
    </div>
  );
}
