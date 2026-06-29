import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SaleReport = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["sale-reports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/sale", {
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

  const handleExcel = () => {
    if (!reports || reports.length === 0) {
      alert("No data found");
      return;
    }
    const excelData = reports.map((user: any, index: number) => ({
      "Sr.": index + 1,
      DOJ: user?.DOJ ? new Date(user.DOJ).toLocaleDateString() : "-",
      "Member ID": user?.MemberID ?? "-",
      Member: user?.MemberName ?? "-",
      "Contact No.": user?.ContactNo ?? "-",
      "Sponsor ID": user?.SponserID ?? "-",
      "Placement ID": user?.PlacementID ?? "-",
      Leaf: user?.Leaf ?? "-",
      State: user?.StateName ?? "-",
      District: user?.CityName ?? "-",
      BV: user?.BV ?? "-",
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

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Sales List
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-yellow-400">
                  {/* {filteredUsers.length} */}
                </span>{" "}
                registered members
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
            <thead className="border-b border-white/10 bg-white/3 text-nowrap">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  DOJ
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Contact No.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sponsor ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Placement ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Leaf
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  State
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  District
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  BV
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index) => (
                <tr
                  key={index}
                  className="transition hover:bg-white/3 text-nowrap"
                >
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>
                  {/* DATE */}

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {new Date(user.DOJ).toLocaleDateString()}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-yellow-400">
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

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.ContactNo || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.SponserID || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.PlacementID || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300 min-w-62.5">
                    {user.Leaf || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.StateName || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.CityName || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.BV || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isFetching && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">No Sales Found</h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default SaleReport;
