import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import ExcelJS from "exceljs";

const WalletTransferReport = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["sale-reports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/wallet-transfer", {
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
                Wallet Transfer List
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
              {reports?.map((user: any, index: number) => (
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

            <h3 className="text-xl font-semibold text-white">
              No Wallet Transfer Records Found
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

export default WalletTransferReport;
