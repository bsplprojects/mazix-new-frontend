import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { AxiosError } from "axios";

const MemberPaymentTransfer = () => {
  const [PANList, setPANList] = useState("");
  const [dateList, setDateList] = useState("");
  const [ids, setIds] = useState<string[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: ["member-payout-date"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/member-payout-date");
      return data;
    },
  });

  const { data: memberPayoutDetails, isLoading } = useQuery({
    queryKey: ["member-payout-details", PANList, dateList],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/member-payout-details", {
        params: {
          dateList,
          PANList,
        },
      });
      return data;
    },
  });

  const reports = memberPayoutDetails || [];

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Buck Softech";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Payout Report");

    worksheet.columns = [
      { header: "Sr.", key: "sr", width: 8 },
      { header: "#", key: "check", width: 8 },
      { header: "Member ID", key: "MemberID", width: 18 },
      { header: "Member", key: "MemberName", width: 28 },
      { header: "PDate", key: "Pdate", width: 16 },
      { header: "PAN", key: "PAN", width: 18 },
      { header: "C-ORG 1", key: "CurrentLeft", width: 15 },
      { header: "C-ORG 2", key: "CurrentRight", width: 15 },
      { header: "Pair", key: "Pair", width: 12 },
      { header: "Bonus", key: "Bonus", width: 12 },
      { header: "Payable", key: "Payable", width: 15 },
      { header: "TDS", key: "TDS", width: 12 },
      { header: "Admin Ch", key: "AdminCharge", width: 15 },
      { header: "Admin (18%)", key: "Admin18", width: 15 },
      { header: "Admin (82%)", key: "Admin82", width: 15 },
      { header: "Voucher", key: "Vouchur", width: 15 },
      { header: "Amount", key: "Amount", width: 15 },
      { header: "Bank Name", key: "Bank", width: 25 },
      { header: "Account No.", key: "AcNo", width: 22 },
      { header: "IFSC", key: "IFSC", width: 18 },
      { header: "Branch", key: "Branch", width: 25 },
      { header: "Flag", key: "Flag", width: 15 },
    ];

    // Header Style
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" },
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    reports.forEach((user: any, index: number) => {
      worksheet.addRow({
        sr: index + 1,
        check: "",
        MemberID: user.MemberID,
        MemberName: user.MemberName,
        Pdate: user.Pdate,
        PAN: user.PAN,
        CurrentLeft: user.CurrentLeft,
        CurrentRight: user.CurrentRight,
        Pair: user.Pair,
        Bonus: user.Bonus,
        Payable: user.Payable,
        TDS: user.TDS,
        AdminCharge: user.AdminCharge,
        Admin18: ((user.AdminCharge || 0) * 18) / 100,
        Admin82: ((user.AdminCharge || 0) * 82) / 100,
        Vouchur: user.Vouchur,
        Amount: user.Amount,
        Bank: user.Bank,
        AcNo: user.AcNo,
        IFSC: user.IFSC,
        Branch: user.Branch,
        Flag: user.Flag,
      });
    });

    // Border + Alignment
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Member_Payout_Report.xlsx",
    );
  };

  const handleCheckAll = () => {
    if (ids.length) {
      setIds([]);
    } else {
      setIds(reports.map((c) => c.BinaryPayoutID));
    }
  };

  const handleCheckBox = (id: string) => {
    const existing = ids.includes(id);
    if (existing) {
      setIds(ids.filter((c) => c !== id));
    } else {
      setIds([...ids, id]);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/payment-transfer/paid`, {
        ids,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment Transfer Successfully.");
      setIds([]);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handlePaid = () => {
    if (!ids.length) {
      toast.error("Please select at least one member.");
      return;
    }
    mutation.mutate();
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Member Payment Transfer
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {reports.length}
                </span>{" "}
                results
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 place-items-end">
          {/*date */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
              Date
            </label>

            <div className="relative">
              <Select value={dateList} onValueChange={setDateList}>
                <SelectTrigger className="h-11 w-full rounded-2xl border border-border bg-card text-foreground focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Payout Date" />
                </SelectTrigger>
                <SelectContent>
                  {data?.length > 0 &&
                    data?.map((date: { Status: string; Flag: string }) => (
                      <SelectItem key={date?.Flag} value={date?.Flag}>
                        {date?.Status}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* type */}
          <div className="space-y-2 w-full">
            <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
              Type
            </label>

            <div className="relative">
              <Select
                value={PANList}
                onValueChange={(val) => setPANList(val === "-1" ? "" : val)}
              >
                <SelectTrigger className="h-11 w-full rounded-2xl border border-border bg-card text-foreground focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"-1"}>ALL</SelectItem>
                  <SelectItem value={"0"}>PAN</SelectItem>
                  <SelectItem value={"1"}>NO PAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* <Button onClick={() => refetch()} className="w-full">
            Display
          </Button> */}
          <Button onClick={handlePaid} className=" w-full">
            Paid
          </Button>
          <Button onClick={handleExcel} className="w-full ">
            <Download /> Excel
          </Button>
        </div>
      </div>

      {/* SALES LIST */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-border bg-muted/40 text-nowrap">
              <tr className="text-left text-nowrap text-xs">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  <Checkbox onCheckedChange={handleCheckAll} />
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  PDate
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  PAN
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground ">
                  C-ORG 1
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground ">
                  C-ORG 2
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Pair
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Bonus
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Payable
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  TDS
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Admin Ch
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Admin(18%)
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Admin(82%)
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Voucher
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Bank Name
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Account No.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  IFSC
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Branch
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Flag
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

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-primary">
                    <Checkbox
                      checked={ids.includes(user.BinaryPayoutID)}
                      onClick={() => handleCheckBox(user.BinaryPayoutID)}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-primary">
                    {user.MemberID || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-primary font-medium">
                        {user.MemberName || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Pdate || "-"}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.PAN || "-"}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.CurrentLeft || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.CurrentRight || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Pair || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Bonus || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Payable || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.TDS || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.AdminCharge || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {((user.AdminCharge * 18) / 100).toFixed(2) || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {((user.AdminCharge * 82) / 100).toFixed(2) || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Vouchur || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Amount || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Bank || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.AcNo || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.IFSC || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Branch || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Flag || 0}
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

export default MemberPaymentTransfer;
