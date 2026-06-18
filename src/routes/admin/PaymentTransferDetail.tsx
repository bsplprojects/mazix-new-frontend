import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";

const PaymentTransferDetail = () => {
  const [memberId, setMemberId] = useState("");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [dateList, setDateList] = useState(
    yesterday.toISOString().split("T")[0],
  );
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["sale-reports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/pay-transfer", {
        params: {
          dateList,
          memberId,
        },
      });
      return data;
    },
    enabled: false,
  });

  const reports = data?.data || [];

  const handleExcel = () => {
    alert("This feature is not available yet");
  };

  return (
    <main>
      <div className="border-b border-white/10 bg-white/2 p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* MEMBER ID SEARCH */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Member ID
              </label>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

                <Input
                  placeholder="RMG1001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white"
                />
              </div>

              <Button
                onClick={() => {
                  setPage(1);
                  refetch();
                }}
                disabled={isFetching}
                className="h-11 w-full rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black"
              >
                {isFetching ? "Loading..." : "Display "}
              </Button>
            </div>
          </div>

          {/* DATE SEARCH */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Payout Date
              </label>

              <Input
                type="date"
                value={dateList}
                onChange={(e) => setDateList(e.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 text-white"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setPage(1);
                    refetch();
                  }}
                  disabled={isFetching}
                  className="h-11 flex-1 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black"
                >
                  {isFetching ? "Loading..." : "Display"}
                </Button>

                <Button onClick={handleExcel} className="h-11 rounded-2xl">
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setMemberId("");
                    setDateList(
                      new Date(Date.now() - 86400000)
                        .toISOString()
                        .split("T")[0],
                    );
                  }}
                  className="h-11 rounded-2xl border-white/10 text-white"
                >
                  Reset
                </Button>
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
                    Payout Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    PAN
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    CurLeft
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    CurRight
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Pair
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Payable
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    TDS
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Admin Charge
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Admin (18%)
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Admin (82%)
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Voucher
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Bonus
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Paid Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Bank Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Ac No
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    IFSC
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Branch
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Paid Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {reports?.map((user: any, index) => (
                  <tr key={index} className="transition hover:bg-white/3">
                    {/* SR NO */}
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                      {index + 1}
                    </td>
                    {/* DATE */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.MemberID}
                    </td>

                    {/* MEMBER ID */}

                    <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                      {user?.MemberName || "-"}
                    </td>

                    {/* MEMBER */}

                    <td className="px-6 py-5">
                      {user?.PayoutDate?.split("T")[0] || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.PAN || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.CurrentLeft || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.CurrentRight || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300 min-w-62.5">
                      {user?.Pair || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Payable || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.TDS || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.AdminCharge || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {(18 * user?.AdminCharge) / 100}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {(82 * user?.AdminCharge) / 100}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Vouchur || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Bonus}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Amount || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.ModifyDate?.split("T")[0] || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Bank || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.AcNo || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.IFSC || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Branch || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Payable || "-"}
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
                No Payment Transfer Records Found
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Try searching with another keyword or dates.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentTransferDetail;
