import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaymentTransferDetail = () => {
  const [memberId, setMemberId] = useState("");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [dateList, setDateList] = useState("");

  const [page, setPage] = useState(1);

  const { data: paidDates } = useQuery({
    queryKey: ["paid-date"],
    queryFn: async () => {
      const res = await axiosInstance.get("/reports/paid-dates");
      return res.data;
    },
  });

  const dates = paidDates?.data || [];

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
    if (!reports || reports.length === 0) {
      alert("No data found");
      return;
    }

    const excelData = reports.map((user: any, index: number) => ({
      "Sr.": index + 1,
      "Member ID": user?.MemberID ?? "-",
      Member: user?.MemberName ?? "-",
      "Payout Date": user?.PayoutDate?.split("T")[0] ?? "-",
      PAN: user?.PAN ?? "-",
      CurLeft: user?.CurrentLeft ?? "-",
      CurRight: user?.CurrentRight ?? "-",
      Pair: user?.Pair ?? "-",
      Payable: user?.Payable ?? "-",
      TDS: user?.TDS ?? "-",
      "Admin Charge": user?.AdminCharge ?? "-",
      "Admin (18%)":
        user?.AdminCharge != null ? (user.AdminCharge * 18) / 100 : "-",
      "Admin (82%)":
        user?.AdminCharge != null ? (user.AdminCharge * 82) / 100 : "-",
      Voucher: user?.Vouchur ?? "-",
      Bonus: user?.Bonus ?? "-",
      Amount: user?.Amount ?? "-",
      "Paid Date": user?.ModifyDate?.split("T")[0] ?? "-",
      "Bank Name": user?.Bank ?? "-",
      "Ac No": user?.AcNo ?? "-",
      IFSC: user?.IFSC ?? "-",
      Branch: user?.Branch ?? "-",
      "Paid Amount": user?.Payable ?? "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 28 },
      { wch: 15 },
      { wch: 18 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 25 },
      { wch: 22 },
      { wch: 18 },
      { wch: 25 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payout Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `Payout_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const handleAction = (val: any) => {
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

              <div className="relative ">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

                <Input
                  placeholder="RMG1001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white"
                />
              </div>

              <Button
                onClick={() => {
                  setPage(1);
                  refetch();
                }}
                disabled={isFetching}
                className="w-full rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black"
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

              {/* <Input
                type="date"
                value={dateList}
                onChange={(e) => setDateList(e.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 text-white"
              /> */}

              <Select value={dateList} onValueChange={setDateList}>
                <SelectTrigger className="h-11 w-full  rounded-2xl border border-white/10 bg-zinc-900/80 text-white">
                  <SelectValue placeholder="Payout Date" />
                </SelectTrigger>
                <SelectContent>
                  {dates?.map((date: any) => (
                    <SelectItem key={date?.Flag} value={date?.Flag}>
                      {date?.Status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setPage(1);
                    refetch();
                  }}
                  disabled={isFetching}
                  className="flex-1 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black"
                >
                  {isFetching ? "Loading..." : "Display"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 justify-end">
          <Button onClick={handleExcel} className=" rounded-2xl">
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setMemberId("");
              setDateList("");
            }}
            className=" rounded-2xl border-white/10 text-white"
          >
            Reset
          </Button>
        </div>

        {/* SALES LIST */}
        <div className="overflow-x-auto mt-5">
          {isFetching ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
            </div>
          ) : (
            <table className="w-full min-w-250">
              <thead className="border-b border-white/10 bg-white/3">
                <tr className="text-left">
                  {/* TABLE HEADER */}
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Sr.
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Member ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Member
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Payout Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    PAN
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    CurLeft
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    CurRight
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Pair
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Payable
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    TDS
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Admin Charge
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Admin (18%)
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Admin (82%)
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Voucher
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Bonus
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Paid Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Bank Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Ac No
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    IFSC
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Branch
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Paid Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 text-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {reports?.map((user: any, index: number) => (
                  <tr
                    key={index}
                    className="transition hover:bg-white/3 text-nowrap"
                  >
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
                      {user?.Bonus || "-"}
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

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      <p
                        onClick={() => handleAction(user)}
                        className="p-1 bg-primary/20 text-primary rounded-full flex items-center justify-center hover:bg-primary/50 transition-all ease-in-out cursor-pointer shadow shadow-primary"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </p>
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
