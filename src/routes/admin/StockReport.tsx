import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useDebounce } from "use-debounce";

const PAGE_SIZE = 10;

const StockReport = () => {
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: [
      "stock-reports",
      page,
      // status,
      // fromDate,
      // toDate,
      debouncedSearch,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/stock", {
        params: {
          FromDate: fromDate,
          status: status,
          Todate: toDate,
          page,
          pageSize: PAGE_SIZE,
          search: debouncedSearch,
        },
      });
      return data;
    },
  });

  const reports = data?.stocksList || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleExcel = () => {
    if (!reports || reports.length === 0) {
      alert("No data found");
      return;
    }
    const excelData = reports.map((user: any, index: number) => ({
      "Sr.": index + 1,
      "Invoice No": `${user?.invoiceNo}-${user?.id}`,
      "Member ID": user?.memberId ?? "-",
      Customer: user?.customerName ?? "-",
      "Contact No.": user?.customerPhone ?? "-",
      Date: new Date(user?.date).toLocaleDateString("en-IN") ?? "-",
      "Total Taxable": user?.totalTaxable ?? "-",
      "Total Discount": user?.totalDiscount ?? "-",
      "Total GST": user?.totalGST ?? "-",
      "Total Amount": user?.Amount ?? "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 6 }, // Sr
      { wch: 15 }, // DOJ
      { wch: 18 }, // Member ID
      { wch: 30 }, // Member
      { wch: 18 }, // Contact
      { wch: 18 }, // Sponsor ID
      { wch: 18 }, // Placement ID
      { wch: 10 }, // Leaf
      { wch: 20 }, // State
      { wch: 20 }, // District
      { wch: 10 }, // BV
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sale Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Sale_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const formatIST = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const filteredStocks = search.trim()
    ? reports.filter((stock: any) =>
        stock?.Product?.toLowerCase().includes(search.toLowerCase()),
      )
    : reports;

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-accent-foreground">
                Stocks
              </h2>

              <p className="mt-1 text-sm text-foreground">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {reports.length}
                </span>{" "}
                results
              </p>
            </div>
          </div>
        </div>

        <div className="md:p-5 mb-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                Search
              </label>
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* STATUS
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* FROM DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground">
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
              <label className="text-xs font-medium uppercase tracking-wider text-foreground">
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
                  setStatus("");
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
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-border bg-muted/40 text-nowrap  ">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Sr.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Product
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Created At
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Last Updated
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Opening Stock
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Stock
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredStocks?.map((user: any, index: number) => (
                <tr
                  key={user?.id}
                  className="transition hover:bg-white/3 text-nowrap"
                >
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5 text-sm ">{user?.Product}</td>

                  {/* MEMBER ID */}
                  <td className="px-6 py-5 text-sm font-medium text-primary uppercase">
                    {formatIST(user?.CreatedAt) || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm  text-accent-foreground">
                    {formatIST(user?.UpdatedAt) || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-primary">
                    {user.openingStock || "0"}
                  </td>

                  <td className="px-6 py-5 text-sm text-primary">
                    {user.stock || "0"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Status || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isFetching && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-foreground">
              No Stocks Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
      </div>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(i + 1);
                }}
              >
                {i + 1}
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
    </main>
  );
};

export default StockReport;
