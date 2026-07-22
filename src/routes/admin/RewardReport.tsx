import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import ExcelJS from "exceljs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { AxiosError } from "axios";

const PAGE_SIZE = "10";

const RewardReport = () => {
  const queryClient = useQueryClient();
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [Designation, setDesignation] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>(PAGE_SIZE);

  const [ids, setIds] = useState<string[]>([]);

  const { data, refetch, isFetching } = useQuery({
    queryKey: [
      "reward-reports",
      page,
      // Designation,
      // fromDate,
      // toDate,
      // memberId,
      rowsPerPage,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/reward", {
        params: {
          Designation,
          FromDate: fromDate,
          MemberId: memberId,
          Todate: toDate,
          all: "",
          page,
          pageSize: rowsPerPage !== "all" ? +rowsPerPage : "all",
        },
      });
      return data;
    },
    enabled: false,
  });

  const reports = data?.data || [];
  const pagination = data?.pagination;
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  const handleExcel = async () => {
    if (!reports?.length) {
      alert("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reward Report");

    worksheet.columns = [
      { header: "Sr.", key: "sr", width: 8 },
      { header: "Member ID", key: "memberId", width: 18 },
      { header: "Member", key: "member", width: 30 },
      { header: "Contact No.", key: "contact", width: 18 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "Reward", key: "reward", width: 30 },
      { header: "Pair", key: "pair", width: 15 },
      { header: "Achieve Pair", key: "achievePair", width: 18 },
      { header: "Bonus", key: "bonus", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 15 },
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
        memberId: user.MemberID || "-",
        member: user.Flag || "-",
        contact: user.RequiredBV || "-",
        designation: user.Designation || "-",
        reward: user.RewardName || "-",
        pair: user.RequiredPV || "-",
        achievePair: user.AchievedPV || "-",
        bonus: user.AchievedBVAmt || "-",
        date: user.ModifyDate
          ? new Date(user.ModifyDate).toLocaleDateString()
          : "-",
        status: user.Status || "-",
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

    // Download
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Reward_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleCheckbox = (id: string) => {
    const existing = ids.includes(id);
    if (existing) {
      setIds(ids.filter((c) => c !== id));
    } else {
      setIds([...ids, id]);
    }
  };

  const handleAll = () => {
    if (ids.length === reports.length) {
      setIds([]);
    } else {
      setIds(reports.map((c) => c.MemberID));
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/reward/paid`, { ids });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reward-reports", page, Designation, fromDate, memberId],
      });
      toast.success("Reward paid successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handlePaid = () => {
    if (!ids.length) {
      toast.error("Please select at least one member");
      return;
    }
    mutation.mutate();
  };

  // filter the data which belongs t0 2025-26
  const filteredReport = reports.filter((report: any) => {
    const yearRange = report.Year;
    const startYear = yearRange.split("-")[0];
    const endYear = "20".concat(yearRange.split("-")[1]);

    const year = new Date(report.ModifyDate).getFullYear();

    console.log(year, startYear, endYear);

    return year >= Number(startYear) && year <= Number(endYear);
  });

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Rewards List
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

        <div className=" border-white/10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* MEMBER ID */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-primary">
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

            {/* Select */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-primary">
                Designation
              </label>
              <Select value={Designation} onValueChange={setDesignation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze Achiever</SelectItem>
                  <SelectItem value="Silver">Silver Achiever</SelectItem>
                  <SelectItem value="Star">Star Achiever</SelectItem>
                  <SelectItem value="Double Star">
                    Double Star Achiever
                  </SelectItem>
                  <SelectItem value="Platinum">Platinum Achiever</SelectItem>
                  <SelectItem value="Director">Director Achiever</SelectItem>
                  <SelectItem value="Sapphire">Sapphire Achiever</SelectItem>
                  <SelectItem value="Diamond">Diamond Achiever</SelectItem>
                  <SelectItem value="Crown">Crown Achiever</SelectItem>
                  <SelectItem value="Crown Diamond">
                    Crown Diamond Achiever
                  </SelectItem>
                  <SelectItem value="Ambassador">
                    Ambassador Achiever
                  </SelectItem>
                  <SelectItem value="Crown Ambassador">
                    Crown Ambassador Achiever
                  </SelectItem>
                  <SelectItem value="Crown Prince">
                    Crown Prince Achiever
                  </SelectItem>
                  <SelectItem value="Double Crown Achiever">
                    DOuble Crown Achiever
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FROM DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-primary">
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
              <label className="text-xs font-medium uppercase tracking-wider text-primary">
                To Date
              </label>

              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-2xl border border-border bg-card text-foreground focus:border-primary focus-visible:ring-primary"
              />
            </div>

            {/* Select */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-primary">
                ROWS PER PAGE
              </label>
              <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Rows Per Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex items-end gap-2 my-4">
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
              onClick={() => {
                setPage(1);
                refetch();
              }}
              disabled={isFetching}
            >
              {isFetching ? "Loading..." : "All Filtered"}
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
        <Button variant={"default"} onClick={handlePaid}>
          Paid
        </Button>
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
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  <Checkbox onClick={handleAll} />
                </th>

                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Sr.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Contact No.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Designation
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Reward
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Pair
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Achieve Pair
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Bonus
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index: number) => (
                <tr
                  key={index}
                  className="transition hover:bg-white/3 text-nowrap text-xs"
                >
                  {/* check */}
                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    <Checkbox
                      checked={ids.includes(user.MemberID)}
                      onClick={() => handleCheckbox(user.MemberID)}
                    />
                  </td>

                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-accent-foreground">
                    {user.MemberID || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-primary font-medium">
                        {user.Flag || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.RequiredBV || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Designation || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.RewardName || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.RequiredPV || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.AchievedPV || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.AchievedBVAmt || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {new Date(user.ModifyDate).toLocaleDateString() || "-"}
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

            <h3 className="text-xl font-semibold text-white">
              No Reward Records Found
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
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination?.hasPrev) {
                  setPage((prev) => prev - 1);
                }
              }}
              className={
                !pagination?.hasPrev ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {(() => {
            const items = [];

            // First page
            items.push(
              <PaginationItem key={1}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>,
            );

            // Left ellipsis
            if (currentPage > 3) {
              items.push(
                <PaginationItem key="left-ellipsis">
                  <PaginationEllipsis />
                </PaginationItem>,
              );
            }

            // Current page -1, current, current +1
            for (
              let i = Math.max(2, currentPage - 1);
              i <= Math.min(totalPages - 1, currentPage + 1);
              i++
            ) {
              items.push(
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i);
                    }}
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>,
              );
            }

            // Right ellipsis
            if (currentPage < totalPages - 2) {
              items.push(
                <PaginationItem key="right-ellipsis">
                  <PaginationEllipsis />
                </PaginationItem>,
              );
            }

            // Last page
            if (totalPages > 1) {
              items.push(
                <PaginationItem key={totalPages}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>,
              );
            }

            return items;
          })()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination?.hasNext) {
                  setPage((prev) => prev + 1);
                }
              }}
              className={
                !pagination?.hasNext ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default RewardReport;
