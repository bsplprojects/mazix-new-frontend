import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IndianRupee, Loader2, Trash, User, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const JoiningWalletTransfer = () => {
  const client = useQueryClient();
  const [transferID, setTransferID] = useState("");
  const [debouncedMemberId] = useDebounce(transferID, 500);
  const [amount, setAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data: adminWallet } = useQuery({
    queryKey: ["admin-wallet"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/wallet/admin`);
      return res.data;
    },
  });

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["wallet-joining"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/wallet/joining-history", {
        params: {
          fdate: fromDate,
          tdate: toDate,
        },
      });
      return data;
    },
    enabled: false,
  });

  const { data: receiverData, isLoading: receiverLoading } = useQuery({
    queryKey: ["receiver", debouncedMemberId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/joining/check-sponsor/${debouncedMemberId}`,
      );
      return res.data;
    },
    enabled: debouncedMemberId.length > 0,
  });

  const reports = data?.data || [];

  const transfer = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/wallet/transfer`, {
        FromMemberID: "admin",
        ToMemberID: transferID,
        TransferWallet: Number(amount),
        MainWallet: adminWallet?.[0]?.Amount,
      });
      return res.data;
    },
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["wallet-joining"] });
      toast.success(data?.Message);
      setAmount("");
      setTransferID("");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.Message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleTransfer = () => {
    if (!amount || !transferID) {
      toast.error("Please fill all the fields");
      return;
    }
    transfer.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/admin/wallet/joining/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["wallet-joining"] });
      toast.success(data?.message);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleDelete = (record: any) => {
    if (!record) return;
    const response = window.confirm(
      "Are you sure you want to delete this record ?",
    );
    if (!response) return;

    deleteMutation.mutate(record.WalletTranferID);
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Joining Wallet Transfer
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-yellow-400">
                  {/* {filteredUsers.length} */}
                </span>{" "}
                registered members
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:items-center justify-center gap-4 flex-col md:flex-row">
          {/* MEMBER ID */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Member ID
            </label>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

              <Input
                defaultValue={"admin"}
                disabled
                className=" rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/*Transfer MEMBER ID */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Transfer Member ID
            </label>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

              <Input
                placeholder="MAZ1001"
                value={transferID}
                onChange={(e) => setTransferID(e.target.value)}
                className=" rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/*Transfer MEMBER Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Member Name
            </label>

            <div className="relative">
              {receiverLoading ? (
                <Loader2 className="h-4 w-4 animate-spin absolute top-1/4 left-3 -transalte-y-1/3 text-yellow-500" />
              ) : (
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />
              )}

              <Input
                value={transferID && receiverData?.MemberName}
                disabled
                className=" rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Amount
            </label>

            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

              <Input
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                className=" rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
              />
            </div>
          </div>

          <Button onClick={handleTransfer} disabled={!transferID || !amount}>
            Transfer
          </Button>
        </div>

        <div className=" bg-white/2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* FROM DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                From Date
              </label>

              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className=" rounded-2xl border border-white/10 bg-zinc-900/80 text-white focus:border-yellow-500"
              />
            </div>

            {/* TO DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                To Date
              </label>

              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-2xl border border-white/10 bg-zinc-900/80 text-white focus:border-yellow-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex items-end gap-2">
              <Button
                onClick={() => {
                  setPage(1);
                  refetch();
                }}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Search"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setTransferID("");
                  setAmount("");
                  setFromDate("");
                  setToDate("");
                }}
                className=""
              >
                Reset
              </Button>

              {/* <Button
                variant={"default"}
                onClick={handleExcel}
                className="h-11 rounded-2xl "
              >
                <Download /> Excel
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* SALES LIST */}
      <div className="overflow-x-auto">
        {isFetching ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-white/10 bg-white/3">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sr.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index) => (
                <tr key={index} className="transition hover:bg-white/3 text-xs">
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                    {user.MemberID || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-white font-medium">
                        {user.MemberName || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.Amount || "-"}
                  </td>

                  {/* DATE */}

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {new Date(user.Date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    <Badge
                      variant={user.Status === "Active" ? "default" : "destructive"}
                    >
                      {user.Status || "-"}
                    </Badge>
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    <Button size={"icon"} onClick={() => handleDelete(user)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isFetching && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No Records Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default JoiningWalletTransfer;
