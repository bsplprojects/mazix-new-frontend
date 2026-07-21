import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, IndianRupee, Loader2, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StatCard } from "@/components/dashboard-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = "10";

const GSTReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [month, setMonth] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

  const { data, isFetching } = useQuery({
    queryKey: ["gst-reports", fromDate, toDate, month, page, rowsPerPage],
    queryFn: async () => {
      const res = await axiosInstance.get("/reports/gst", {
        params: {
          FromDate: fromDate || undefined,
          ToDate: toDate || undefined,
          month: month || undefined,
          page,
          pageSize: rowsPerPage,
        },
      });

      return res.data;
    },
  });

  const reports = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalRecords = data?.totalRecords ?? 0;
  const totalGST = data?.totalGST ?? 0;

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate, month]);

  const handleExcel = async () => {
    if (!reports?.length) {
      alert("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Buck Softech";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Member Report");

    worksheet.columns = [
      { header: "Sr.", key: "sr", width: 8 },
      { header: "DOJ", key: "doj", width: 15 },
      { header: "Member ID", key: "memberId", width: 18 },
      { header: "Member", key: "memberName", width: 28 },
      { header: "Contact No.", key: "contactNo", width: 18 },
      { header: "Sponsor ID", key: "sponsorId", width: 18 },
      { header: "Placement ID", key: "placementId", width: 18 },
      { header: "Leaf", key: "leaf", width: 12 },
      { header: "State", key: "state", width: 20 },
      { header: "District", key: "district", width: 20 },
      { header: "BV", key: "bv", width: 12 },
    ];

    // Header Styling
    const headerRow = worksheet.getRow(1);

    headerRow.height = 24;

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E40AF" },
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add Data
    reports.forEach((user: any, index: number) => {
      const row = worksheet.addRow({
        sr: index + 1,
        doj: user.DOJ ? new Date(user.DOJ).toLocaleDateString() : "-",
        memberId: user.MemberID || "-",
        memberName: user.MemberName || "-",
        contactNo: user.ContactNo || "-",
        sponsorId: user.SponserID || "-",
        placementId: user.PlacementID || "-",
        leaf: user.Leaf || "-",
        state: user.StateName || "-",
        district: user.CityName || "-",
        bv: Number(user.BV || 0),
      });

      row.height = 22;

      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: colNumber === 1 || colNumber === 11 ? "center" : "left",
        };
      });
    });

    // Format BV Column
    worksheet.getColumn("bv").numFmt = "0.00";

    // Freeze Header
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // Generate Excel
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Member_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10  lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                GST Report
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-yellow-400">
                  {reports.length}
                </span>{" "}
                results out of{" "}
                <span className="font-semibold text-yellow-400">
                  {totalRecords}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-1/4 w-full">
          <StatCard
            label="Total GST"
            value={totalGST}
            tone="emerald"
            icon={<IndianRupee className="h-4 w-4" />}
          />
        </div>

        <div className="border-b border-white/10 bg-white/2 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* FROM DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Month
              </label>

              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
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
                className="rounded-lg border border-white/10 bg-zinc-900/80 text-white focus:border-yellow-500"
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
                className="rounded-lg border border-white/10 bg-zinc-900/80 text-white focus:border-yellow-500"
              />
            </div>

            {/* ROWS PER PAGE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Rows per page
              </label>

              <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* BUTTONS */}
            <div className="flex items-end gap-2">
              <Button
                onClick={() => {
                  setPage(1);
                }}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Search"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setMonth("");
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
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-white/10 bg-white/3 text-nowrap">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sr.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Order No
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Order Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Total Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Total GST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Total Discount
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

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                    {user?.MemberID || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5 text-sm  text-zinc-300">
                    {user?.OrderNo || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm  text-zinc-300">
                    {new Date(user?.OrderDate).toLocaleDateString("en-IN") ||
                      "-"}
                  </td>

                  <td className="px-6 py-5 text-sm  text-zinc-300">
                    {user?.TotalAmount || "-"}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                    {user?.TotalGST || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user?.TotalDiscount || "-"}
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
              No Wallet Transfer Records Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
        <div className="flex items-center justify-between mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(page - 3, 0), Math.min(page + 2, totalPages))
                .map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={page === p}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
};

export default GSTReport;
