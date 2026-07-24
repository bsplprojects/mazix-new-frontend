import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import ExcelJS from "exceljs";

const ProductSaleReport = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["sale-reports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/product-sale", {
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
    const worksheet = workbook.addWorksheet("GST Report");

    worksheet.columns = [
      { header: "Sr.", key: "sr", width: 8 },
      { header: "Date", key: "date", width: 15 },
      { header: "Member ID", key: "memberId", width: 18 },
      { header: "Member", key: "memberName", width: 30 },
      { header: "State", key: "state", width: 18 },
      { header: "District", key: "district", width: 18 },
      { header: "Product", key: "product", width: 35 },
      { header: "BV", key: "bv", width: 12 },
      { header: "MRP", key: "mrp", width: 12 },
      { header: "Member MRP", key: "memberMrp", width: 15 },
      { header: "Qty", key: "qty", width: 10 },
      { header: "Taxable Amount", key: "taxable", width: 18 },
      { header: "GST %", key: "gst", width: 10 },
      { header: "CGST", key: "cgst", width: 12 },
      { header: "SGST", key: "sgst", width: 12 },
      { header: "IGST", key: "igst", width: 12 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Total BV", key: "totalBV", width: 15 },
    ];

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
        date: new Date(user.MPDate).toLocaleDateString(),
        memberId: user.MemberID,
        memberName: user.MemberName,
        state: user.StateName,
        district: user.CityName,
        product: user.Product,
        bv: Number(user.BV || 0),
        mrp: Number(user.MRP || 0),
        memberMrp: Number(user.MemberMRP || 0),
        qty: Number(user.Qty || 0),
        taxable: Number(user.TMRP || 0),
        gst: Number(user.GST || 0),
        cgst: Number(calc?.cgst || 0),
        sgst: Number(calc?.sgst || 0),
        igst: Number(calc?.igst || 0),
        amount: Number(calc?.net || 0),
        totalBV: Number(user.TBV || 0),
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      row.height = 22;

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: rowNumber === 1 ? "center" : "left",
        };
      });
    });

    [
      "bv",
      "mrp",
      "memberMrp",
      "taxable",
      "cgst",
      "sgst",
      "igst",
      "amount",
      "totalBV",
    ].forEach((col) => {
      worksheet.getColumn(col).numFmt = "0.00";
    });

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `GST_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const calculateGST = (user: any) => {
    const TotalMem = parseFloat(user.MemberMRP) * parseFloat(user.Qty || 0);
    const gstRate = parseFloat(user.GST || 0);

    const tgst = (TotalMem * gstRate) / (100 + gstRate);

    const isJharkhand =
      (user.StateName || "").trim().toLowerCase() === "jharkhand";

    if (isJharkhand) {
      return {
        cgst: (tgst / 2).toFixed(2),
        sgst: (tgst / 2).toFixed(2),
        igst: 0,
        net: (TotalMem - tgst).toFixed(2),
      };
    } else {
      return {
        cgst: 0,
        sgst: 0,
        igst: tgst.toFixed(2),
        net: (TotalMem - tgst).toFixed(2),
      };
    }
  };

  return (
    <main>
      <div className="flex flex-col gap-4  border-white/10  lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-accent-foreground text-nowrap">
                Product Sales List
              </h2>

              <p className="mt-1 text-sm text-accent-foreground">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {reports.length}
                </span>{" "}
                results
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 bg-white/2 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* MEMBER ID */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                Member ID
              </label>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

                <Input
                  placeholder="RMG1001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="rounded-2xl border border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* FROM DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                From Date
              </label>

              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-2xl border border-border bg-card text-foreground focus:border-primary focus-visible:ring-primary"
              />
            </div>

            {/* TO DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                To Date
              </label>

              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-2xl border border-border bg-card text-foreground focus:border-primary focus-visible:ring-primary"
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
                  setMemberId("");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Reset
              </Button>

              <Button variant={"default"} onClick={handleExcel}>
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
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-border bg-muted/40 text-nowrap">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  State
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  District
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Product
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  BV
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  MRP
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member MRP
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Qty
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Taxable Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  GST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  CGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  SGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  IGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Total BV
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index: number) => {
                const calc = calculateGST(user);

                return (
                  <tr
                    key={index}
                    className="transition hover:bg-white/3 text-xs text-nowrap"
                  >
                    {/* SR NO */}
                    <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                      {index + 1}
                    </td>
                    {/* DATE */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {new Date(user.MPDate).toLocaleDateString()}
                    </td>

                    {/* MEMBER ID */}

                    <td className="px-6 py-5 text-sm font-medium text-primary">
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

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.StateName || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.CityName || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.Product || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                      {user.BV || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.MRP || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.MemberMRP || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.Qty || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.TMRP || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.GST || 0}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {Number(calc?.cgst || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {Number(calc?.sgst || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {Number(calc?.igst || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {Number(calc?.net || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.TBV || 0}
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

            <h3 className="text-xl font-semibold text-accent-foreground">
              No Product Sale Record Found
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

export default ProductSaleReport;
