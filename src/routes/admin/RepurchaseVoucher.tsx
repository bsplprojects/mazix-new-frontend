import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import ExcelJS from "exceljs";

const RepurchaseVoucher = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["sale-reports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/repurchase-voucher", {
        params: {
          FromDate: fromDate,
          MemberId: memberId,
          Todate: toDate,
        },
      });
      return data;
    },
    enabled: false,
  });

  const reports = data?.data || [];

  const handleExcel = async () => {
    if (!reports?.length) {
      alert("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Product GST Report");

    worksheet.columns = [
      { header: "Sr.", key: "sr", width: 8 },
      { header: "Date", key: "date", width: 15 },
      { header: "Member ID", key: "memberId", width: 18 },
      { header: "Member", key: "memberName", width: 30 },
      { header: "Category", key: "category", width: 20 },
      { header: "Product", key: "product", width: 35 },
      { header: "MRP", key: "mrp", width: 12 },
      { header: "Quantity", key: "qty", width: 10 },
      { header: "Taxable Amt", key: "taxable", width: 18 },
      { header: "GST (%)", key: "gst", width: 10 },
      { header: "CGST", key: "cgst", width: 12 },
      { header: "SGST", key: "sgst", width: 12 },
      { header: "IGST", key: "igst", width: 12 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    // Header Style
    const header = worksheet.getRow(1);

    header.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E40AF" },
    };

    header.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    reports.forEach((user: any, index: number) => {
      const calc = calculateGST(user);

      worksheet.addRow({
        sr: index + 1,
        date: user?.ModifyDate
          ? new Date(user.ModifyDate).toLocaleDateString()
          : "-",
        memberId: user?.MemberID || "-",
        memberName: user?.MemberName || "-",
        category: user?.Category || "-",
        product: user?.Product || "-",
        mrp: Number(user?.MRP || 0),
        qty: Number(user?.Qty || 0),
        taxable: Number(calc.baseAmount || 0),
        gst: Number(user?.GST || 0),
        cgst: Number(calc.cgst || 0),
        sgst: Number(calc.sgst || 0),
        igst: Number(calc.igst || 0),
        amount: Number(calc.totalMem || 0),
      });
    });

    // Styling
    worksheet.eachRow((row, rowNumber) => {
      row.height = 22;

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: rowNumber === 1 ? "center" : "left",
        };
      });
    });

    // Number Formatting
    ["mrp", "taxable", "cgst", "sgst", "igst", "amount"].forEach((col) => {
      worksheet.getColumn(col).numFmt = "0.00";
    });

    // Freeze Header
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // Download
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Product_GST_Report_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  function calculateGST(item: any) {
    const mrp = Number(item.MRP || 0);
    const qty = Number(item.Qty || 0);
    const gst = Number(item.GST || 0);

    const totalMem = mrp * qty;

    const tgst = gst > 0 ? (totalMem * gst) / (100 + gst) : 0;

    const isSameState = item.StateID === 20 || item.StateID === "20";

    return {
      totalMem,
      cgst: isSameState ? tgst / 2 : 0,
      sgst: isSameState ? tgst / 2 : 0,
      igst: isSameState ? 0 : tgst,
      baseAmount: totalMem - tgst,
      totalGST: tgst,
    };
  }

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Repurchase (Voucher) List
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-yellow-400">
                  {/* {filteredUsers.length} */}
                </span>{" "}
                results
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* MEMBER ID */}
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
                  className="rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
                />
              </div>
            </div>

            {/* FROM DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                From Date
              </label>

              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-2xl border border-white/10 bg-zinc-900/80 text-white focus:border-yellow-500"
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
                className="flex-1 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black"
              >
                {isFetching ? "Loading..." : "Search"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setMemberId("");
                  setFromDate("");
                  setToDate("");
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
              >
                Reset
              </Button>

              <Button
                variant={"default"}
                onClick={handleExcel}
                className="rounded-2xl "
              >
                <Download /> Excel
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
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Product
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  MRP
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Quantity
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Taxable Amt
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  GST (%)
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  CGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  SGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  IGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index: number) => {
                const calc = calculateGST(user);
                return (
                  <tr key={index} className="transition hover:bg-white/3">
                    {/* SR NO */}
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                      {index + 1}
                    </td>
                    {/* DATE */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {new Date(user?.ModifyDate).toLocaleDateString()}
                    </td>

                    {/* MEMBER ID */}

                    <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                      {user?.MemberID || "-"}
                    </td>

                    {/* MEMBER */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="text-white font-medium">
                          {user?.MemberName || "-"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Category || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.Product || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.MRP?.toFixed(2) || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300 min-w-62.5">
                      {user?.Qty || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {calc.baseAmount.toFixed(2) || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user?.GST?.toFixed(2) || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {calc.cgst.toFixed(2) || "-"}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {calc.sgst.toFixed(2) || "-"}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {calc.igst.toFixed(2) || "-"}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {calc.totalMem.toFixed(2) || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!isFetching && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No Repurchase Voucher Found
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

export default RepurchaseVoucher;
