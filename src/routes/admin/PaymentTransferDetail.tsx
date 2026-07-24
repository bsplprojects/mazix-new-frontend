import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Trash, Users } from "lucide-react";
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
import { toast } from "sonner";
import { AxiosError } from "axios";

const PaymentTransferDetail = () => {
  const [memberId, setMemberId] = useState("");
  const client = useQueryClient();

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

  const delMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(
        `/admin/reports/pay-transfer/${id}`,
      );
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["sale-reports"] });
      toast.success("Deleted Successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleDelete = (val: any) => {
    const response = window.confirm(
      "Are you sure you want to delete this record?",
    );
    if (!response) return;

    delMutation.mutate(val?.BinaryPayoutID);
  };

  return (
    <main>
      <div className="border-b border-white/10 ">
        <div className="mb-5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Payment Transfer List
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Showing{" "}
            <span className="font-semibold text-primary">{reports.length}</span>{" "}
            results
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* MEMBER ID SEARCH */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                Member ID
              </label>

              <div className="relative ">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

                <Input
                  placeholder="RMG1001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="rounded-2xl border border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
                />
              </div>

              <Button
                onClick={() => {
                  setPage(1);
                  refetch();
                }}
                disabled={isFetching}
                className="w-full"
              >
                {isFetching ? "Loading..." : "Display "}
              </Button>
            </div>
          </div>

          {/* DATE SEARCH */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                Payout Date
              </label>

              {/* <Input
                type="date"
                value={dateList}
                onChange={(e) => setDateList(e.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 text-white"
              /> */}

              <Select value={dateList} onValueChange={setDateList}>
                <SelectTrigger className="h-11 w-full rounded-2xl border border-border bg-card text-foreground focus:border-primary focus:ring-primary">
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
                  className="w-full"
                >
                  {isFetching ? "Loading..." : "Display"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 justify-end">
          <Button onClick={handleExcel} className=" rounded-2xl">
            <Download className="h-4 w-4" />
            Excel
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setMemberId("");
              setDateList("");
            }}
            className=" rounded-2xl border-white/10 text-accent-foreground"
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
              <thead className="border-b border-border bg-muted/40 text-nowrap">
                <tr className="text-left">
                  {/* TABLE HEADER */}
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Sr.
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Member ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Member
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Payout Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    PAN
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    CurLeft
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    CurRight
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Pair
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Payable
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    TDS
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Admin Charge
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Admin (18%)
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Admin (82%)
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Voucher
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Bonus
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Paid Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Bank Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Ac No
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    IFSC
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Branch
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Paid Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground text-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {reports?.map((user: any, index: number) => (
                  <tr
                    key={index}
                    className="transition hover:bg-white/3 text-nowrap text-xs"
                  >
                    {/* SR NO */}
                    <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                      {index + 1}
                    </td>
                    {/* DATE */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.MemberID}
                    </td>

                    {/* MEMBER ID */}

                    <td className="px-6 py-5 text-sm font-medium text-primary">
                      {user?.MemberName || "-"}
                    </td>

                    {/* MEMBER */}

                    <td className="px-6 py-5">
                      {new Date(user?.PayoutDate)?.toLocaleDateString(
                        "en-IN",
                      ) || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.PAN || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.CurrentLeft || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.CurrentRight || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                      {user?.Pair || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.Payable || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.TDS || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.AdminCharge || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {(18 * user?.AdminCharge) / 100}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {(82 * user?.AdminCharge) / 100}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.Vouchur || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.Bonus || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.Amount || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.ModifyDate?.split("T")[0] || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.Bank || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.AcNo || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.IFSC || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.Branch || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user?.Payable || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
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

              <h3 className="text-xl font-semibold text-accent-foreground">
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
