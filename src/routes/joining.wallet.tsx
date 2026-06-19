import { Wallet, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { recentTransactions, member } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import Loader from "@/components/Loader";
import { toast } from "sonner";

export default function JoiningWallet() {
  const [toMemberId, setToMemberId] = useState("");
  const [transferWallet, setTransferWallet] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
    type: "all",
  });

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter((t) => {
      const search = filters.search.toLowerCase();

      const matchSearch =
        search === "" ||
        t.name?.toLowerCase().includes(search) ||
        t.memberId?.toLowerCase().includes(search);

      const matchType =
        filters.type === "all"
          ? true
          : filters.type === "credit"
            ? t.amount > 0
            : t.amount < 0;

      const tDate = new Date(t.date);
      const from = filters.fromDate ? new Date(filters.fromDate) : null;
      const to = filters.toDate ? new Date(filters.toDate) : null;

      const matchFrom = !from || tDate >= from;
      const matchTo = !to || tDate <= to;

      return matchSearch && matchType && matchFrom && matchTo;
    });
  }, [filters]);

  const memberID = sessionStorage.getItem("memberID");

  const { data, isLoading } = useQuery({
    queryKey: ["member-wallet", memberID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/wallet/${memberID}`);
      return res.data;
    },
  });

  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["member-wallet-history", memberID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/wallet/history/${memberID}`);
      return res.data;
    },
  });

  const w = data?.[0];
  const h = history;

  const transfer = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/wallet/transfer`, {
        FromMemberID: memberID,
        ToMemberID: toMemberId,
        TransferWallet: Number(transferWallet),
        MainWallet: Number(w?.Amount),
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.Message);
      setTransferWallet(0);
      setToMemberId("");
    },
  });

  if (isLoading || isHistoryLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 max-w-350 mx-auto">
      <PageHeader
        title="E-Wallet"
        subtitle="Available balance, payouts and withdrawal history"
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* WALLET CARD */}
        <div className=" rounded-2xl bg-gradient-hero border border-border/60 p-8 shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-emerald opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 text-brass">
              <Wallet className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">
                Available Balance
              </span>
            </div>

            <div className="font-display text-5xl text-gradient-emerald mb-1">
              ₹{w?.Amount.toLocaleString("en-IN")}
            </div>

            {/* <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/40">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Received
                </div>
                <div className="font-display text-xl text-brass">
                  ₹{member.pendingPayout.toLocaleString("en-IN")}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Send
                </div>
                <div className="font-display text-xl">
                  ₹{member.lifetimeEarnings.toLocaleString("en-IN")}
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* SEND WALLET CARD */}
        <div className=" rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <h3 className="font-display text-lg mb-4 flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            Send Wallet Balance
          </h3>

          <div className="space-y-4">
            {/* MEMBER ID */}
            <div>
              <label className="text-xs text-muted-foreground">
                Receiver Member ID
              </label>
              <input
                type="text"
                value={toMemberId}
                onChange={(e) => setToMemberId(e.target.value)}
                placeholder="Enter Member ID"
                className="w-full h-11 mt-1 px-3 rounded-md bg-input border border-border focus:outline-none"
              />
            </div>

            {/* AMOUNT */}
            <div>
              <label className="text-xs text-muted-foreground">Amount</label>
              <input
                type="number"
                value={transferWallet}
                onChange={(e) => setTransferWallet(Number(e.target.value))}
                placeholder="Enter Amount"
                className="w-full h-11 mt-1 px-3 rounded-md bg-input border border-border focus:outline-none"
              />
            </div>

            {/* SEND BUTTON */}
            <Button
              disabled={!toMemberId || !transferWallet}
              onClick={() => transfer.mutate()}
              className="w-full h-11 bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
            >
              Send Now
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border/60 shadow-card overflow-hidden">
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Transaction Ledger</h2>

            {/* TYPE FILTER */}
          </div>

          {/* FILTER BAR */}
          <div className="grid md:grid-cols-3 gap-3">
            {/* GLOBAL SEARCH (Name + Member ID combined) */}
            <div className="md:col-span-2 flex items-center gap-2 px-3 h-10 rounded-md bg-input border border-border">
              <span className="text-xs text-muted-foreground">🔎</span>

              <input
                placeholder="Search by Name or Member ID"
                className="w-full bg-transparent outline-none text-sm"
                value={filters.search}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, search: e.target.value }))
                }
              />
            </div>

            {/* DATE RANGE */}
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full h-10 px-3 rounded-md bg-input border border-border text-xs"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, fromDate: e.target.value }))
                }
              />

              <input
                type="date"
                className="w-full h-10 px-3 rounded-md bg-input border border-border text-xs"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, toDate: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">Member ID</th>
              <th className="text-left px-6 py-3">Member</th>
              <th className="text-left px-6 py-3">Transfer ID</th>
              <th className="text-left px-6 py-3">Amount</th>
              <th className="text-right px-6 py-3">Type</th>
              <th className="text-right px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {h &&
              h.map((t: any, idx: number) => (
                <tr key={idx} className="hover:bg-accent/30 transition-smooth">
                  <td className="px-6 py-4 font-mono text-xs">{t?.id}</td>
                  <td className="px-6 py-4">{t?.type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{t?.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t?.status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-display text-base ${t?.amount > 0 ? "text-foreground" : "text-brass"}`}
                  >
                    {t?.amount > 0 ? "+" : ""}₹
                    {Math.abs(t?.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
