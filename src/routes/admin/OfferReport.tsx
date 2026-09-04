import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Download, Gift, Loader2, Users } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OfferReport = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [rank, setRank] = useState("all");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [qty, setQty] = useState("25");

  const mutation = useMutation({
    mutationFn: async (page: number) => {
      const res = await axiosInstance.get("/reports/offer", {
        params: {
          FromDate: fromDate,
          MemberId: memberId,
          Todate: toDate,
          rank: rank,
          page: String(page),
          qty,
          pageSize: qty,
        },
      });
      return res.data;
    },
  });

  const reports = mutation?.data?.data || [];
  const pagination = mutation?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleExcel = () => {
    if (!reports || reports.length === 0) {
      alert("No data found");
      return;
    }
    const excelData = reports.map((user: any, index: number) => ({
      "Sr.": index + 1,
      "Member ID": user?.MemberID ?? "-",
      FromMemberId: user?.FromMemberID ?? "-",
      LeftBV: user?.LeftBV,
      RightBV: user?.RightBV,
      LeftCount: user?.LeftCount,
      RightCount: user?.RightCount ?? "-",
      Date: user?.ModifyDate ?? "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 6 }, // Sr
      { wch: 18 }, // Member ID
      { wch: 30 }, // From Member ID
      { wch: 18 }, // left BV
      { wch: 18 }, // right BV
      { wch: 18 }, // left count
      { wch: 10 }, // right count
      { wch: 20 }, // Date
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Offer Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Offer_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleSearch = (page: number) => {
    const MIN_DATE = "2026-08-04";
    const MAX_DATE = "2026-09-15";

    if (!fromDate) {
      toast.error(`From Date is required`);
      return;
    }

    if (!toDate) {
      toast.error(`To Date is required`);
      return;
    }

    if (fromDate && (fromDate < MIN_DATE || fromDate > MAX_DATE)) {
      toast.error(
        `From Date must be between 4th Aug, 2026 and 15th Sept, 2026`,
      );
      return;
    }

    if (toDate && (toDate < MIN_DATE || toDate > MAX_DATE)) {
      toast.error(`To Date must be between 4th Aug, 2026 and 15th Sept, 2026`);
      return;
    }

    if (fromDate && toDate && fromDate > toDate) {
      toast.error("From Date cannot be greater than To Date");
      return;
    }

    setPage(page);
    mutation.mutate(page);
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex mb-2 items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500">
            ⚠ Report in only available between 4<sup>th</sup> Aug, 2026 - 15
            <sup>th</sup> Sept, 2026
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Monsoon Offer List
              </h2>

              <p className="mt-1 text-sm text-accent-foreground">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {reports.length}
                </span>{" "}
                results out of{" "}
                <span className="font-semibold text-primary">
                  {pagination?.totalRecords || 0}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* MEMBER ID */}
            <div className="space-y-2 hidden">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                Member ID
              </label>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-foreground" />

                <Input
                  placeholder="RMG1001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="rounded-2xl border border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Rank */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                Rank
              </label>

              <Select value={rank} onValueChange={setRank}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Rank" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="star">Star</SelectItem>
                  <SelectItem value="double star">Double Star</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="sapphire">Sapphire</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="crown">Crown</SelectItem>
                  <SelectItem value="crown diamond">Crown Diamond</SelectItem>
                  <SelectItem value="ambassador">Ambassador</SelectItem>
                  <SelectItem value="crown ambassador">
                    Crown Ambassador
                  </SelectItem>
                  <SelectItem value="prince">Prince</SelectItem>
                  <SelectItem value="crown prince">Crown Prince</SelectItem>
                  <SelectItem value="king of mazix">King Of Mazix</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground opacity-0">
                Rank
              </label>

              <Select value={qty} onValueChange={setQty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
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
                onClick={() => handleSearch(1)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Loading..." : "Search"}
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

      {/* OFFER LIST */}
      <div className="overflow-x-auto">
        {mutation.isPending ? (
          <div className="flex min-h-100 flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute h-20 w-20 rounded-full border-2 border-border" />

              {/* Animated ring */}
              <div className="h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-accent border-r-accent" />

              {/* Inner loader */}
              <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-base font-semibold text-foreground">
                Fetching reports
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                This may take a little while. Please don’t close or refresh the
                page.
              </p>
            </div>

            {/* Animated progress dots */}
            <div className="mt-4 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
            </div>
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
                  Sponsor ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Leaf
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Self BV
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  ORG 1 BV
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  ORG 2 BV
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Total ORG BV
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Weak Leg BV
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Bronze Pairs
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Silver Pairs
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Star Pairs
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Achievement
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Qualified
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  DOJ
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
                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </td>

                  {/* MEMBER ID */}
                  <td className="px-6 py-5 text-sm font-medium text-accent-foreground">
                    {user.MemberID || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="text-primary font-medium">
                        {user.SponserID || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Leaf}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.SelfBV}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Org1BV}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.Org2BV}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.TotalOrgBV}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.WeakLegBV}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.BronzePairs}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.SilverPairs}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.StarPairs}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.Achievement}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.IsBronzeQualified
                      ? "Bronze"
                      : user.isSilverQualified
                        ? "Silver"
                        : user.isStarQualified
                          ? "Star"
                          : user.isDoubleStarQualified
                            ? "Double Star"
                            : user.isPlatinumQualified
                              ? "Platinum"
                              : "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {new Date(user.DOJ).toISOString().split("T")[0] || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!mutation.isPending && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Gift className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No Offer report data found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
      </div>

      <Pagination className="mt-6">
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) {
                  handleSearch(page - 1);
                }
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* First page */}
          {page > 3 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {/* Pages around current page */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;

            if (page <= 3) {
              pageNumber = i + 1;
            } else if (page >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = page - 2 + i;
            }

            return pageNumber;
          })
            .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
            .map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={page === pageNumber}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

          {/* Last page */}
          {page < totalPages - 2 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page < totalPages) {
                  handleSearch(page + 1);
                }
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

export default OfferReport;
