import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import ExcelJS from "exceljs";
import { useNavigate } from "react-router-dom";

const RepurchaseReport = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate("");

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["repurchase-reports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/repurchase", {
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
    const worksheet = workbook.addWorksheet("Member Report");

    worksheet.columns = [
      { header: "Sr.", key: "sr", width: 8 },
      { header: "Order No", key: "orderNo", width: 15 },
      { header: "Order Date", key: "orderDate", width: 18 },
      { header: "Customer", key: "customerName", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "City", key: "city", width: 18 },
      { header: "Total Amount", key: "totalAmount", width: 18 },
      { header: "Pay Mode", key: "payMode", width: 12 },
      { header: "Delivery Status", key: "deliveryStatus", width: 20 },
      { header: "Delivery Partner", key: "deliveryPartner", width: 20 },
      { header: "Tracker ID", key: "trackerId", width: 12 },
      { header: "Products(Qty)", key: "products", width: 12 },
      { header: "Total CGST", key: "totalCGST", width: 12 },
      { header: "Total SGST", key: "totalSGST", width: 12 },
      { header: "Total IGST", key: "totalIGST", width: 12 },
      { header: "Total GST", key: "totalGST", width: 12 },
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

    // Data
    reports.forEach((user: any, index: number) => {
      worksheet.addRow({
        sr: index + 1,
        orderNo: user.OrderNo,
        orderDate: user.OrderDate
          ? new Date(user.OrderDate).toLocaleDateString()
          : "-",
        customerName: user.CustomerName || "-",
        phone: user.any || "-",
        city: user.City || "-",
        totalAmount: user.TotalAmount || "-",
        payMode: user.PayMode,
        deliveryStatus: user.DeliveryStatus || "-",
        deliveryPartner: user.DeliveryPartner || "-",
        trackerId: user.TrackingID || "-",
        products: user.ItemCount || "0",
        totalCGST: user.TotalCGST || "0",
        totalSGST: user.TotalSGST || "0",
        totalIGST: user.TotalIGST || "0",
        totalGST: user.TotalGST || "0",
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
    link.download = `Repurchase_report_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 lg:flex-col  lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Repurchase List
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
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  From Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs">
              {reports?.map((user: any, index: number) => (
                <tr
                  key={index}
                  className="transition hover:bg-white/3 text-nowrap "
                >
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {user.MemberID || "-"}
                  </td>

                  {/* CUSTOMER NAME */}
                  <td className="px-6 py-5 text-sm font-medium text-primary">
                    {user.Amount || "-"}
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-5 text-sm text-zinc-300 ">
                    {user.FromMemberID || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.Flag || "-"}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {new Date(user.ModifyDate).toLocaleDateString()}
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
              No Repurchase Records Found
            </h3>

            <p className="mt-2 text-sm text-accent-foreground">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default RepurchaseReport;
