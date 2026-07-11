import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Download, Loader2, Trash, Users } from "lucide-react";
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
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const InvoiceList = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["invoice-reports", page, memberId, fromDate, toDate],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/sale/invoice", {
        params: {
          FromDate: fromDate,
          MemberId: memberId,
          Todate: toDate,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      return data;
    },
    placeholderData: (prev) => prev,
    enabled: false,
  });

  const reports = data?.invoiceList || [];
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

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/admin/sale/invoice/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleCancelInvoice = (id: string) => {
    if (
      window.confirm("Are you sure you want to cancel this invoice?") === false
    )
      return;
    cancelMutation.mutate(id);
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Invoices
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-yellow-400">
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
                  Invoice No
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Contact No.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Total Taxable
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Total Discount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Total GST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Total Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Payment Mode
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index: number) => (
                <tr
                  key={user?.id}
                  className="transition hover:bg-white/3 text-nowrap"
                >
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5 text-sm text-primary underline">
                    <Link
                      to={`/admin/invoice/stock?id=${user.id}&inv=${user.invoiceNo}&type=for_stock`}
                    >
                      {user?.invoiceNo + "/" + user?.id}
                    </Link>
                  </td>

                  {/* MEMBER ID */}
                  <td className="px-6 py-5 text-sm font-medium text-yellow-400 uppercase">
                    {user.memberId || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm  text-zinc-300">
                    {user.customerName || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.customerPhone || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {new Date(user.date).toLocaleDateString("en-IN") || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.totalTaxable || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300 min-w-62.5">
                    {user.totalDiscount}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.totalGST || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.totalAmount || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.paymentMode || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    <Button
                      onClick={() => handleCancelInvoice(user.id)}
                      variant={"destructive"}
                      size={"sm"}
                    >
                      <Trash />
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
              No Invoices Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}

        <Pagination className="mt-6">
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

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href="#"
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
      </div>
    </main>
  );
};

export default InvoiceList;
